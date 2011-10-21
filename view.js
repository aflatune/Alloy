var used = [Ti.UI.createWindow];

Alloy.View = new JS.Class({
  include: Util.EventListener,
  rendered: false,
  
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
      
      //this.view.top = 0;
      //this.view.bottom = 0;
      //this.view.left = 0;
      //this.view.right = 0;
      
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
