Alloy.ViewModel = new JS.Class(/** @lends Alloy.ViewModel */{
  extend: {
    CachePolicy: {
      Disabled: 1,        // No caching, i.e. fetch directly from web service, no offline support
      OfflineOnly: 2,     // Use cached data only when offline. When online, fetch from web service and store in cache.
      CacheAndFetch: 3,   // First use cached data, then fetch from web service and use that data. 2 calls to dataReady() if cache hit.
      CacheAndServe: 4},  // If cache hit, do not fetch again from web service. Useful for tracking unique app installs, etc. 
  },
    
  /**
    <p>Defines the Alloy ViewModel class.</p>
    
    <p>ViewModel typically represents all data needed to render a View. Data is downloaded by
    calling a web service and is optionally cached in local database.
    
    To create a view model, define a subclass and override
    appropriate methods.</p>

    @example
//-- Contents of Resources/app.js --

// Alloy
Ti.include ('lib/alloy/alloy.js');
includeRJSS('lib/alloy/ui/alloy_ui.rjss');

// App
var App = {};

// Views

// View models

// Include our RJSS
includeRJSS('app/rjss/common.rjss');
compileRJSS();

App.SampleViewModel = new JS.Class(Alloy.ViewModel, {
  initialize: function(view) {
    this.callSuper(view);
    this.name = 'sample'; 
    this.httpVerb = 'GET';
  },

  url: function(params) {
    return 'https://graph.facebook.com/amol.kelkar';
  }
});

App.SampleView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper();
    this.name = 'sample_view';
  },

  render: function() {
    this.callSuper();
  
    this.label = new Label({text: 'Hello from Alloy!', textAlign: 'center', color: '#888'});
    this.view.add(this.label);

    this.viewModel = new App.SampleViewModel(this);
    this.viewModel.fetch();
  },

  dataReady: function(data) {
    this.label.text = "Hello from " + data.name + "!";
  }
})

var v = new App.SampleView();
v.render();
v.open();
    
    @class Alloy ViewModel class

    @author Amol Kelkar
    @since Alloy 1.0
    @see Alloy, Alloy.View
    
    @constructs
    @param {Alloy.View} [view=null] View associated with this View Model.
      When view is specified, view.dataReady(...) or view.onError(...) method is invoked
      when data is received or an error occurs, respectively. Here's the typical usage -

  */
  initialize: function(view) {
    this.view = view;
    this.data = null;
    this.currentRequest = null;
    this.cachePolicy = Alloy.ViewModel.CachePolicy.OfflineOnly;
    this.httpVerb = 'GET';
    this.showLoginViewOn403 = false;
  },
  
  block: function() {
    this.blocked = true;
  },
  
  unblock: function() {
    this.blocked = false;
  },
  
  fetch: function(params) {
    if (this.blocked)
      return;
    
    var url = this.url(params);
    info("Fetching " + url);
    
    if (typeof(params) == 'undefined') params = {};
    Alloy.analytics.trackEvent('alloy:view_model:' + this.name, 'fetch', url);

    // Skip reading from cache when --
    if (
        // getting more rows, OR
        //params.type == 'more' ||
        // cache policy is to never cache, OR
        this.cachePolicy == Alloy.ViewModel.CachePolicy.Disabled ||
        // cache policy is to use cache only when offline and we are online
        (this.cachePolicy == Alloy.ViewModel.CachePolicy.OfflineOnly && Titanium.Network.online)) {
      params.skip_cache = true;
      params.mustFetchFromWebService = true;
    }

    // Fetch from cache if enabled
    if (!params.skip_cache) {
      var cachedData = this.readCachedData(url);
      if (cachedData) {
        this.dataReady(cachedData, params);
      }
      else {
        params.mustFetchFromWebService = true;
      }
      
      // Fetch from web service --
      if (
        // we had a cache miss, OR
        !cachedData ||
        // unless we want to cache once and then never call server again
        this.cachePolicy != Alloy.ViewModel.CachePolicy.CacheAndServe) {
        params.skip_cache = true;
        this.fetch(params);
      }
      return;      
    }

    if (params.mustFetchFromWebService && !Titanium.Network.online) {
      var a = Titanium.UI.createAlertDialog({
        title:'Offline',
        message:'Sorry, you must be online for that.'
      });
      a.show();
      return;
    }
    
    var xhr = Titanium.Network.createHTTPClient();
    this.currentRequest = xhr;
    
    xhr.open(this.httpVerb, url);
    
    this.setRequestHeaders(xhr, params);
    
    var _this = this;
    
    xhr.onload = function() {
      Alloy.analytics.trackEvent('alloy:view_model:' + _this.name, 'success', url);

      if (!params.async)
        Ti.App.fireEvent('app:hide:loader');

      //if(this.status >= 400) {
      //  this.onerror();
      //  return;
      //}
      _this.currentRequest = null;
      
      //info("xhr Call returned");
      //info(this.responseText);
      var data;
      try {
        data = _this.parseData(this);
      }
      catch(e) {}
      
      if (!data) {
        _this.onError(this, params);
        return;
      }
      
      if (data && !_this.blocked) {
        _this.dataReady(data, params);
        if (_this.view && _this.view.dataReady)
          _this.view.dataReady(data, params, _this);
          
        if (_this.cachePolicy != Alloy.ViewModel.CachePolicy.Disabled) {
          _this.cacheData(url, data);
        }
      }
    }
    
    xhr.onerror = function() {
      Alloy.analytics.trackEvent('alloy:view_model:' + _this.name, 'error', url);
      _this.onError(this, params);
      if (!params.async)
        Ti.App.fireEvent('app:hide:loader');
      _this.currentRequest = null;
    }
    
    if (!params.async) {
      if (params.message)
        Ti.App.fireEvent('app:loader:setMessage', {message: params.message});
      Ti.App.fireEvent('app:show:loader');
    }
    
    this.sendRequest(xhr, params);
  },

  sendRequest: function(xhr, params) {
    xhr.send();
  },
  
  parseData: function(response) {
    return eval('('+response.responseText+')');
  },
  
  readCachedData: function(url) {
    //info("Reading cached data for url " + url);
    var data = null;
    
    try {
      var sql = 'SELECT data from view_model_cache WHERE url = ?;';
      var rows = Alloy.Database.getInstance().db.execute(sql, this.getCacheKey(url));
      if (rows.getRowCount() > 0 && rows.isValidRow()) {
        data = eval('(' + rows.fieldByName('data') + ')');
      }
      rows.close();
    }
    catch(exception) {
      Ti.API.error(exception);
      return null;
    }
    //info("Data returned: " + JSON.stringify(data));
    return data;
  },
  
  cacheData: function(url, data) {
    //info("Caching data for url: " + url);
    try {
      var sql = 'INSERT OR REPLACE INTO view_model_cache (url,data) VALUES (?,?)';
      Alloy.Database.getInstance().db.execute(sql, this.getCacheKey(url), JSON.stringify(data));
    }
    catch(exception) {
      Ti.API.error(exception);
    }
    //info("Done");
  },
  
  getCacheKey: function(url) {
    return url;
  },
  
  dataReady: function(data, params) {
    this.data = data;
  },
  
  onError: function(response) {
    if (response.status == 0) {
      Ti.App.fireEvent('app:network:timeout');
    }
    
    if (this.view && this.view.onError)
      this.view.onError(response, this);

    if (this.showLoginViewOn403 && response.status == 403) {
      Ti.App.fireEvent('app:login:show');
    }
    
    // handle network error
    warn(JSON.stringify(response));
  },
  
  sameObjects: function(obj1, obj2) {
    if (!obj1.json) obj1.json = JSON.stringify(obj1);
    if (!obj2.json) obj2.json = JSON.stringify(obj2);
    
    if (!obj1.md5) obj1.md5 = md5(obj1.json);
    if (!obj2.md5) obj2.md5 = md5(obj2.json);
    
    var result = (obj1.md5 == obj2.md5) && (obj1.json == obj2.json);
    if (!result) {
      //info("    obj1: " + obj1.md5 + " -- " + obj1.json);
      //info("    obj2: " + obj2.md5 + " -- " + obj2.json);
    }
    return result;
  },
  
  setRequestHeaders: function(xhr, params) {
  },
  
  url: function(params) {
    return null; // must override
  },
  
  abortFetch: function() {
    //info("********** ABORT fetch!")
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }
  }
});
