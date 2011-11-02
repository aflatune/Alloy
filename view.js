var used = [Ti.UI.createWindow];

Alloy.View = new JS.Class(/** @lends Alloy.View */{
  include: Util.EventListener,
  rendered: false,
  
  /**
    <p>Defines the Alloy View class.</p>
    
    <p>View typically represents one screen in your
    Titanium mobile application. To create a view, define a subclass and override
    appropriate methods.</p>

@example
//-- Contents of Resources/app.js --

// Alloy
Ti.include('lib/alloy/alloy.js');
includeRJSS('lib/alloy/ui/alloy_ui.rjss');
compileRJSS();

// App
var App = {};

// Views

// View models

// Include our RJSS

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
  }
})

var v = new App.SampleView();
v.render();
v.open();
    
    @class Alloy View class

    @borrows Util.EventListener
    @author Amol Kelkar
    @since Alloy 1.0
    @see Alloy
    
    @constructs
    @param {boolean} [partial=false] Whether to instantiate the View as a partial.
      When true, View is created only with a view, without a window. You then add the view in another view or window.
  */ 
  initialize: function(partial) {
    this.view = new View();
    
    if (!partial) {
      this.window = Ti.UI.createWindow();
      $(this.window).applyStyle('Window', { className: 'viewWindow' });
      var _this = this;
      this.addEventListener(this.window, 'focus', function() {
        _this.trackViewShowEvent();
      });
      this.addEventListener(this.window, 'close', function() {
        _this.removeEventListeners();
      });
      
      this.window.add(this.view);
    }
  },

  analyticsPageUrl: function() {
    return (this.name || '(anonymous)');
  },
  
  trackViewShowEvent: function() {
    Alloy.analytics.trackPageview('/' + this.analyticsPageUrl());
  },
  
  render: function() {
    this.rendered = true;
  },
  
  open: function(params) {
    params = params || {};
    var _this = this;
    if (params.modal == 'simulated' && params.animated) {
      setTimeout(function() {
        _this.openWithSimulatedAnimation(params);
      }, 10);      
    }
    else {
      if (params.nav) {
        if (params.nav == 'global'){
          if (App.tabGroup && App.tabGroup.activeTab) {
            params.nav = App.tabGroup.activeTab;
          }
          else
            params.nav = true;
        }

        // nav = true means create a new nav group
        if (typeof(params.nav) == "boolean") {
          var contentWindow = new Window();
          contentWindow.navBarHidden = true;
          var nav = Ti.UI.iPhone.createNavigationGroup({
            window:this.window
          });
          this.nav = nav;
          this.navWrapper = contentWindow;
          
          contentWindow.add(nav);
          contentWindow.open({modal:true});
        }
        else {
          this.nav = params.nav;
          this.nav.open(this.window, params);
        }
      }
      else {
        this.window.open(params);
      }
    }
  },
  
  openWithSimulatedAnimation: function(params) {
    // Toolbar
    var flexSpace = Titanium.UI.createButton({
      systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    
    var items = [];
    if (this.window.leftNavButton) {
      this.window.leftNavButton.style = Ti.UI.iPhone.SystemButtonStyle.DONE;
      items.push(this.window.leftNavButton);
    }

    items.push(flexSpace);
    
    if (this.window.title) {
      var title = new Label('windowTitle');
      title.text = this.window.title;
      items.push(title);
    }

    items.push(flexSpace);
    
    if (this.window.rightNavButton) {
      this.window.rightNavButton.style = Ti.UI.iPhone.SystemButtonStyle.DONE;
      items.push(this.window.rightNavButton);
    }
    
    var toolbar = new Toolbar({
      items: items,
      top:0,
      translucent:true,
      barColor: '#000'
    });

    this.window.add(toolbar);
    this.view.top = 40;
    
    this.simulatedModal = true;
    this.window.top = Titanium.Platform.displayCaps.platformHeight - 40; //this.window.height;
    
    var a = new Animation();
    params.modal = false;
    this.window.open(params);
    a.top = 0;
    a.duration = 500;
    this.window.animate(a);
  },
  
  close: function(params) {
    params = params || {};
    var _this = this;
    
    var w = _this.navWrapper || _this.window;
    
    if (this.simulatedModal && params.animated) {
      var a = new Animation();
      a.top = this.window.height;
      a.duration = 500;
      a.addEventListener('complete', function() {
        w.close({animated: false});
      })
      w.animate(a);
    }
    else {
      w.close(params);
    }
  }
});
