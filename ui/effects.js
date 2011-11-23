Alloy.UI.Effects = {
  fadeOut: function(view, duration) {
    var a = new Animation();
    a.opacity = 0;
    if (duration)
      a.duration = duration;
    view.animate(a);
  },
  
  fadeIn: function(view, duration) {
    var a = new Animation();
    a.opacity = 1;
    if (duration)
      a.duration = duration;
    view.animate(a);
  },

  bump: function(view) {
    var t = Ti.UI.create2DMatrix().scale(1.3);
    view.transform = t;
    
    var t2 = Ti.UI.create2DMatrix().scale(1);
    var a = new Animation();
    a.transform = t2;
    view.animate(a); 
  },
  
  activate: function(view, onComplete) {
    var t = Ti.UI.create2DMatrix().scale(2);
    var a = new Animation();
    a.transform = t;
    a.opacity = 0;
    a.addEventListener('complete', function() {
      if (onComplete)
        onComplete();
        
      var a2 = new Animation();
      var t2 = Ti.UI.create2DMatrix().scale(1);
      a2.transform = t2;
      a2.opacity = 1;
      a2.duration = 300;
      setTimeout(function() {
        view.animate(a2);       
      }, 1000);
    });
    view.animate(a);     
  },
  
  nod: function(view) {
    var count = 0;
    
    var left = Ti.UI.create2DMatrix().rotate(-15);
    var leftAnimation = new Animation();
    leftAnimation.transform = left;
    leftAnimation.duration = 200;
    
    var right = Ti.UI.create2DMatrix().rotate(15);
    var rightAnimation = new Animation();
    rightAnimation.transform = right;
    rightAnimation.duration = 200;
    
    leftAnimation.addEventListener('complete', function() {
      if (count < 10) {
        view.animate(rightAnimation);
        count++;
      }
      else {
        var t = Ti.UI.create2DMatrix().rotate(0);
        var anim = new Animation();
        anim.transform = t;
        view.animate(anim);
      }
    })

    rightAnimation.addEventListener('complete', function() {
      if (count < 10) {
        view.animate(leftAnimation);
        count++;
      }
      else {
        var t = Ti.UI.create2DMatrix().rotate(0);
        var anim = new Animation();
        anim.transform = t;
        view.animate(anim);
      }
    })
    
    view.animate(leftAnimation);
  }
}

