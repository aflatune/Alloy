Alloy.UI.FullscreenView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper(/*Never partial*/ false);
  },
  
  render: function(title) {
    var _this = this;
    
    this.callSuper();
    this.window.backgroundColor = '#000';
    this.window.barColor = 'transparent';
    this.window.navBarHidden = true;

    var closeButton = new Alloy.ImageButton({
      backgroundImage:'/public/images/profile/close.png',
      backgroundImageDown:'/public/images/profile/close-pressed.png',
      height: 40,
      width: 40,
      left: 4,
      top: 4,
      zIndex: 1000});
    this.view.add(closeButton);
    this.addEventListener(closeButton, 'press', function() {
      _this.close();
    });
    closeButton.hide();
        
    // Toolbar
    /*var items = [];

    var flexSpace = Titanium.UI.createButton({
      systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    
    var closeButton = new Alloy.ImageButton({title: 'Close'});
    this.addEventListener(closeButton, 'press', function() {
      _this.close();
    })
    
    items.push(closeButton);
    items.push(flexSpace);

    var t = new Label('windowTitle');
    t.text = title;
    items.push(t);

    items.push(flexSpace);
    
    var toolbar = new Toolbar({
      items: items,
      top:0,
      translucent:false,
      barColor: '#000'
    });

    toolbar.hide();
    this.window.add(toolbar);
    this.toolbarHidden = true;*/
    
    var hidden=true;
    this.addEventListener(this.window, 'click', function() {
      if (!hidden)
      {
        closeButton.hide();
        hidden = true;
      }
      else
      {
        closeButton.show();
        hidden = false;
      }
    })
  },
  
  open: function(params) {
    params = params || {};
    params['fullscreen'] = true;
    this.callSuper(params);
  }
})
