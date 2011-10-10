var used = [Ti.UI.createWindow];

Alloy.View = new JS.Class({
  rendered: false,
  
  initialize: function(partial) {
    this.view = new View();
    
    if (!partial) {
      this.window = Ti.UI.createWindow();
      $(this.window).applyStyle('Window', { className: 'viewWindow' });
      var _this = this;
      this.window.addEventListener('focus', function() {
        _this.trackViewShowEvent();
      });
      this.view.top = 0;
      this.view.bottom = 0;
      this.view.left = 0;
      this.view.right = 0;
      
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
      this.window.open(params);
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
    //a.duration = 3000;
    this.window.animate(a);
  },
  
  close: function(params) {
    params = params || {};
    
    if (this.simulatedModal && params.animated) {
      var _this = this;
      var a = new Animation();
      a.top = Titanium.Platform.displayCaps.platformHeight - 40;
      a.addEventListener('complete', function() {
        _this.window.close({animated: false});
      })
      this.window.animate(a);
    }
    else {
      this.window.close(params);
    }
  }
});
