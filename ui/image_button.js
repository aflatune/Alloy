Alloy.ImageButton = function(params) {
  params.text = params.title;
  
  var button = new Label(params);
  $(button).applyStyle('ImageButton', params);
  
  if (button.backgroundImage) {
    button.backgroundImageNormal = button.backgroundImage;
    
    if (button.backgroundImagePressed) {
      button.addEventListener('touchstart', function() {
        info('touchstart');
        button.backgroundImage = button.backgroundImagePressed;
      });
      
      button.addEventListener('touchend', function() {
        info('touchend');
        button.backgroundImage = button.backgroundImageNormal;
      });  
  
      button.addEventListener('touchcancel', function() {
        info('touchcancel');
        button.backgroundImage = button.backgroundImageNormal;
      });
    }
  }  
  
  return button;
}
