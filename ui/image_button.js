Alloy.ImageButton = function(params) {
  if (!params)
    params = {};
    
  if (typeof(params) == 'string')
    params = {className: params};
    
  params.text = params.title;
  params.stickyTime = params.stickyTime || 1;
  
  var button = new Label(params);
  $(button).applyStyle('ImageButton', params);
  
  if (button.backgroundImage) {
    button.backgroundImageNormal = button.backgroundImage;
    
    if (button.backgroundImagePressed) {
      button.addEventListener('touchstart', function() {
        button.backgroundImage = button.backgroundImagePressed;
        button.pressInProgress = true;
      });
      
      button.addEventListener('touchend', function() {
        setTimeout(function() {
          button.backgroundImage = button.backgroundImageNormal;
        }, params.stickyTime);
        
        if (button.pressInProgress) {
          button.fireEvent('press');
          button.pressInProgress = false;
        }
      });  
  
      button.addEventListener('touchcancel', function() {
        button.backgroundImage = button.backgroundImageNormal;
        button.pressInProgress = false;
      });

      button.addEventListener('touchmove', function() {
        button.backgroundImage = button.backgroundImageNormal;
        button.pressInProgress = false;
      });

    }
  }  
  
  return button;
}
