// Tell the compiler which modules we are going to use; note there are no () on these!
var used = [Ti.UI.createActivityIndicator];

Alloy.UI.LoadingView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper(true);   // Partial view
    this.view.zIndex = 1000;
    this.view.visible = false;
  },
  
  render: function(params) {
    params = params || {};
    
    var backdropHeight = params.height || 100;
    var backdropWidth = params.width || 200;
    
    var backdrop = new View('loadingViewContainer');
    backdrop.left = Ti.Platform.displayCaps.platformWidth / 2 - backdropWidth / 2;
    backdrop.width = backdropWidth;;
    backdrop.top = Ti.Platform.displayCaps.platformHeight / 2 - backdropHeight / 2 - 25;
    backdrop.height = backdropHeight;
    backdrop.opacity = 0;

    // Background
    var background = new View('loadingViewBackground');
    backdrop.add(background);
    
    // Loader animation
    var loaderContainer = new View('loadingViewLoaderContainer');
    var loader = new ActivityIndicator('loadingViewActivityIndicator');
    loaderContainer.add(loader);
    backdrop.add(loaderContainer);

    // Message
    this.messageLabel = new Label('loadingViewMessageLabel');
    backdrop.add(this.messageLabel);
    
    this.view.add(backdrop);
    //this.view.add(loader);
    
    var _this = this;
    
    this.showCount = 0;
    Ti.App.addEventListener('app:show:loader', function() {
      _this.showCount++;
      
      if (_this.showCount == 1 && !_this.view.visible) {
        _this.view.visible = true;
        loader.show();
        
        var t1 = Ti.UI.create2DMatrix().scale(0.1);
        backdrop.transform = t1;
        backdrop.opacity = 0;
        
        var t2 = Ti.UI.create2DMatrix().scale(1);
        var a = Ti.UI.createAnimation();

        a.transform = t2;
        a.opacity = 1;
        a.duration = 200;

        backdrop.animate(a);
      }
    });

    var t3 = Ti.UI.create2DMatrix().scale(1.3);
    var a3 = Ti.UI.createAnimation();

    a3.transform = t3;
    a3.opacity = 0;
    a3.duration = 300;

    a3.addEventListener('complete',function() {
      loader.hide();
      _this.view.visible = false;
    });
    
    Ti.App.addEventListener('app:hide:loader', function() {
      _this.showCount--;
      if (_this.showCount < 0) _this.showCount = 0;
      
      if (_this.showCount == 0 && _this.view.visible) {
        backdrop.animate(a3);          
      }
    });

    Ti.App.addEventListener('app:loader:setMessage', function(params) {
      _this.setMessage(params.message);
    });
  },
  
  setMessage: function(message) {
    this.messageLabel.text = message;
  }
});
