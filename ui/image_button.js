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

  // timeout to allow children to be added to the button before wring up events
  setTimeout(function() {
    Alloy.UI.actsLikeButton(button);  
  }, 1);
  
  return button;
}
