Alloy.ImageButton = function(params) {
  if (!params)
    params = {};
    
  if (typeof(params) == 'string')
    params = {className: params};
    
  params.text = params.title;
  params.stickyTime = params.stickyTime || 1;
  
  var button = new Label(params);
  button.color = params.color || '#fff';
  button.colorPressed = params.colorPressed || '#fff';
  $(button).applyStyle('ImageButton', params);
  
  if (button.backgroundImage) {
    button.backgroundImageNormal = button.backgroundImage;
    button.colorNormal = button.color;
    
    if (button.backgroundImagePressed) {
      button.addEventListener('touchstart', function() {
        button.backgroundImage = button.backgroundImagePressed;
        button.color = button.colorPressed;
        button.pressInProgress = true;
      });
      
      button.addEventListener('touchend', function() {
        setTimeout(function() {
          button.backgroundImage = button.backgroundImageNormal;
          button.color = button.colorNormal;
        }, params.stickyTime);
        
        if (button.pressInProgress) {
          button.fireEvent('press');
          button.pressInProgress = false;
        }
      });  
  
      button.addEventListener('touchcancel', function() {
        button.backgroundImage = button.backgroundImageNormal;
        button.color = button.colorNormal;
        button.pressInProgress = false;
      });

      button.addEventListener('touchmove', function() {
        button.backgroundImage = button.backgroundImageNormal;
        button.color = button.colorNormal;
        button.pressInProgress = false;
      });

    }
  }  
  
  return button;
}
