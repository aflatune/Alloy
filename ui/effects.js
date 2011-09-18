Alloy.UI.Effects = {
  bump: function(view) {
    var t = Ti.UI.create2DMatrix().scale(1.3);
    view.transform = t;
    
    var t2 = Ti.UI.create2DMatrix().scale(1);
    var a = new Animation();
    a.transform = t2;
    view.animate(a); 
  }
}

