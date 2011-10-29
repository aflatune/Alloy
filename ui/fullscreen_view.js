Alloy.UI.FullscreenView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper(/*Never partial*/ false);
  },
  
  render: function(title) {
    var _this = this;
    
    this.callSuper();
    this.window.backgroundColor = '#fff';

    // Toolbar
    var items = [];

    var flexSpace = Titanium.UI.createButton({
      systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    
    var closeButton = new Button('toolbarButton');
    closeButton.title = 'Close';
    this.addEventListener(closeButton, 'click', function() {
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
    this.toolbarHidden = true;
    
    this.addEventListener(this.view, 'click', function() {
      if (_this.toolbarHidden)
        toolbar.show();
      else
        toolbar.hide();
        
      _this.toolbarHidden = !_this.toolbarHidden;
    })
  },
  
  open: function(params) {
    params = params || {};
    params['fullscreen'] = true;
    this.callSuper(params);
  }
})
