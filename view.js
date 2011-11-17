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
        App.currentWindow = _this.window;
        App.currentView = _this;
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
    var navWindow = this.window;
    
    if (params.modal == 'simulated' && params.animated) {
      setTimeout(function() {
        _this.openWithSimulatedAnimation(params);
      }, 10);      
    }
    else if (params.modal == 'dialog') {
      this.openAsDialog(params);
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
          navWindow = contentWindow;
          
          contentWindow.add(nav);
          contentWindow.open({modal:true});
        }
        else {
          this.nav = params.nav;
          
          if (!params.leftNavButtonTitle && App.currentWindow)
            params.leftNavButtonTitle = App.currentWindow.title;

          if (!params.leftNavButtonTitle && this.nav.window)
            params.leftNavButtonTitle = this.nav.window.title;
            
          this.nav.open(this.window, params);
        }
        
        if (!params.leftNavButtonTitle) {
          params.leftNavButtonTitle = 'Back';
        }
      }
      else {
        this.window.open(params);
      }
    }
    
    
    if (params.leftNavButtonTitle && !this.window.leftNavButton) {
      var title = '  ' + params.leftNavButtonTitle;
      var imageButton = new Alloy.ImageButton({title: title, className: 'backButton'});
      var width = title.length * 8;
      if (width < 70)
        width = 70;
      if (width > 160)
        width = 160;
      imageButton.width = width;
      
      this.window.leftNavButton = imageButton;
      this.addEventListener(imageButton, 'press', function() {
        navWindow.close();
      })
    }
  },
  
  openAsDialog: function(params) {
    App.currentDialogParentWindow = App.currentWindow;
    
    var _this = this;
    this.addEventListener(this.window, 'click', function() {
      _this.close();
    })
    this.window.backgroundColor = 'transparent';
    this.simulatedDialog = true;
    this.view.top = Titanium.Platform.displayCaps.platformHeight - 40; //this.window.height;
    
    params.modal = false;
    params.viewHeight = params.viewHeight || 250;
    this.window.open(params);

    var a = new Animation();
    a.top = Titanium.Platform.displayCaps.platformHeight - params.viewHeight + 16;
    this.view.animate(a);
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
    
    if (App.currentDialogParentWindow) {
      App.currentWindow = App.currentDialogParentWindow;
      App.currentWindow.fireEvent('focus');
      App.currentDialogParentWindow = null;
    }
  },
  
  clear: function() {
    if (this.window) {
      this.window.remove(this.view);
      this.view = null;
      
      this.view = new View();
      this.window.add(this.view);
    }
  }
});
