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
      });
      
      button.addEventListener('touchend', function() {
        setTimeout(function() {
          button.backgroundImage = button.backgroundImageNormal;
        }, params.stickyTime);
      });  
  
      button.addEventListener('touchcancel', function() {
        button.backgroundImage = button.backgroundImageNormal;
      });
    }
  }  
  
  return button;
}
