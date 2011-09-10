// Tell the compiler which modules we are going to use; note there are no () on these!
var used = [];

Alloy.UI.LoadingView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper(true);   // Partial view
    this.view.zIndex = 1000;
  },
  
  render: function() {
    var backdropHeight = 100;
    var backdropWidth = 200;
    
    var backdrop = new View({
      backgroundColor:'#000',
      opacity:0.8,
      left: Ti.Platform.displayCaps.platformWidth / 2 - backdropWidth / 2,
      width: backdropWidth,
      top: Ti.Platform.displayCaps.platformHeight / 2 - backdropHeight / 2,
      height: backdropHeight,
      borderRadius: 20,
      borderWidth: 10,
      borderColor: '#777'
    });
    
    //var t1 = Titanium.UI.create2DMatrix().scale(0.4);
    
    /*var loader = new View({
      backgroundImage:'images/logo_med.png',
      height:80,
      width:80,
      transform: t1
    });
    */
   
    var loader = Ti.UI.createActivityIndicator({
      style: Ti.UI.iPhone.ActivityIndicatorStyle.BIG,
      message: 'Loading...',
      width: 'auto',
      color: '#fff',
      font: {fontSize: 20}
    });
    
    backdrop.add(loader);
    
    this.view.add(backdrop);
    //this.view.add(loader);
    
    var _this = this;
    
    this.showCount = 0;
    Ti.App.addEventListener('app:show.loader', function() {
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
        a.opacity = 0.9;
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
    
    Ti.App.addEventListener('app:hide.loader', function() {
      _this.showCount--;
      
      if (_this.showCount == 0 && _this.view.visible) {
        backdrop.animate(a3);          
      }
    });
  }
});
