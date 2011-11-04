Alloy.ImageButton = function(params) {
  params.height = params.height || 30;
  if (!params.title) {
    warn("Must specify title for ImageButton");
  }
  
  params.text = params.title;
  params.width = params.width || params.title.length * 12;
  params.font = params.font || {fontSize: 12, fontWeight: 'bold'};
  params.textAlign = params.textAlign || 'center';
  params.color = params.color || "#fff";
  
  var button = new Label(params);
  $(button).applyStyle('ImageButton', params.className);
  
  if (button.backgroundImage) {
    button.backgroundImageNormal = button.backgroundImage;
    
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
  
  return button;
}
