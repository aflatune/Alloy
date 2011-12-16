// Tell the compiler which modules we are going to use; note there are no () on these!

Alloy.UI.NotificationView = new JS.Class(Alloy.View, {
  initialize: function(parentView) {
    this.callSuper(true);   // Partial view
    this.view.zIndex = 2000;
    this.parentView = parentView;
    parentView.add(this.view);
  },
  
  render: function(params) {
    params = params || {};
    params.image = params.image || '/lib/alloy/ui/images/check.png';
    params.message = params.message || 'Done!';
    params.duration = params.duration || 2000;
    this.duration = params.duration;
    
    var backdropHeight = params.height || 88;
    var backdropWidth = params.width || 138;
    
    var backdrop = new View('notificationViewContainer');
    this.backdrop = backdrop;
    backdrop.left = Ti.Platform.displayCaps.platformWidth / 2 - backdropWidth / 2;
    backdrop.width = backdropWidth;;
    backdrop.top = Ti.Platform.displayCaps.platformHeight / 2 - backdropHeight / 2 - 25;
    backdrop.height = backdropHeight;
    backdrop.opacity = 0;
    
    // Background
    var background = new View('notificationViewBackground');
    backdrop.add(background);
    
    // Loader animation
    var iconContainer = new View('notificationViewIconContainer');
    var icon = new ImageView('notificationViewIcon');
    icon.image = params.image;
    iconContainer.add(icon);
    backdrop.add(iconContainer);

    // Message
    this.messageLabel = new Label({className: 'notificationViewMessageLabel', text: params.message});
    backdrop.add(this.messageLabel);
    
    this.view.add(backdrop);
    //this.view.add(loader);
  },
  
  show: function() {
    var t1 = Ti.UI.create2DMatrix().scale(0.1);
    this.backdrop.transform = t1;
    this.backdrop.opacity = 0;
    
    var t2 = Ti.UI.create2DMatrix().scale(1);
    var a = Ti.UI.createAnimation();

    a.transform = t2;
    a.opacity = 1;
    a.duration = 200;

    this.backdrop.animate(a);
    
    var _this = this;
    setTimeout(function() {
      _this.hide();
    }, this.duration);
  },

  hide: function() {
    var _this = this;
    var t3 = Ti.UI.create2DMatrix().scale(1.3);
    var a3 = Ti.UI.createAnimation();

    a3.transform = t3;
    a3.opacity = 0;
    a3.duration = 300;
    a3.addEventListener('complete', function() {
      _this.view.hide();
      _this.parentView.remove(_this.view);
    })
    this.backdrop.animate(a3);          
  }

});
