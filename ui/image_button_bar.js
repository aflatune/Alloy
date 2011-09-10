var used = [Ti.UI.createScrollView, Ti.UI.createImageView];

Alloy.UI.ImageButtonBarButton = new JS.Class({
  extend: {
    createImageButtonBarButton: function(params) {
      return new Alloy.UI.ImageButtonBarButton(params);
    }
  },
  
  initialize: function(params) {
    var buttonWrapper = new Alloy.UI.CachedImageView(params);
    this.backgroundView = new View(params);
    
    this.button = buttonWrapper.imageView;
    this.button.width = params.width;
    this.id = params.id;
    
    buttonWrapper.setImage(params.image);
    this.buttonWrapper = buttonWrapper;
    this.tabView = null;
  } 
});

redux.fn.addNaturalConstructor(this, Alloy.UI.ImageButtonBarButton, 'ImageButtonBarButton', 'ImageButtonBarButton');

Alloy.UI.ImageButtonBar = new JS.Class({
  extend: {
    createImageButtonBar: function(params) {
      return new Alloy.UI.ImageButtonBar(params);
    }
  },
  
  initialize: function(params) {
    this.toolbarView = new ScrollView(params);
    this.buttons = [];
    this.currentButton = null;
    this.parentView = params.parentView;
  },
  
  createView: function(id) {
    error('Must implement ImageButtonBar::createView, called when switching to a tab for the first time');
  },
  
  add: function(button) {
    button.button.left = (button.button.width + 0) * this.buttons.length;
    button.backgroundView.left = button.button.left;
    button.button.buttonIndex = this.buttons.length;
    
    var _this = this;
    button.button.addEventListener('click', function(e) {
      var switchingView = !_this.currentButton || _this.currentButton.button.buttonIndex != e.source.buttonIndex;

      if (switchingView) {
        if (_this.currentButton) {
          _this.currentButton.backgroundView.backgroundColor = 'transparent';
          _this.currentButton.tabView.view.opacity = 0;
          _this.currentButton = null;
        }
  
        _this.currentButton = _this.buttons[e.source.buttonIndex];      
        _this.currentButton.backgroundView.backgroundColor = '#F9D439';
        if (_this.currentButton.tabView) {
          _this.currentButton.tabView.view.opacity = 1;
        }
      }  
      
      if (_this.currentButton.tabView) {
        Ti.App.fireEvent('imageButtonBar:switchToRenderedTab');
      }
      else {
        var tabView = _this.renderTab(_this.currentButton.id);
        _this.parentView.view.add(tabView.view);
        tabView.render();

        _this.currentButton.tabView = tabView;
      }
      
      Ti.App.fireEvent('imageButtonBar:switchToTab');
    });
    
    this.buttons.push(button);
    this.toolbarView.add(button.backgroundView);
    this.toolbarView.add(button.button);
  }
});

redux.fn.addNaturalConstructor(this, Alloy.UI.ImageButtonBar, 'ImageButtonBar', 'ImageButtonBar');
