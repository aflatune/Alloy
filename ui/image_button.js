Alloy.ImageButton = function(params) {
  params.text = params.title;
  params.stickyTime = params.stickyTime || 1;
  
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
        setTimeout(function() {
          button.backgroundImage = button.backgroundImageNormal;
        }, params.stickyTime);
      });  
  
      button.addEventListener('touchcancel', function() {
        info('touchcancel');
        button.backgroundImage = button.backgroundImageNormal;
      });
    }
  }  
  
  return button;
}
