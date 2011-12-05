Alloy.UI.actsLikeButton = function(control) {
  var feather = 40;

  function eventInfo(e) {
    //info('Event ' + e.type + ' - globalPoint: ' + e.globalPoint.x + ',' + e.globalPoint.y + '; x: ' + e.x + "; y: " + e.y);
  }

  function withinBounds(e) {
    return e.x > -feather && e.x < feather + e.source.width && e.y > -feather && e.y < feather + e.source.height;
  } 
  
  function recursiveChildVisitor(control, action) {
    action(control);
    if (control.children) {
      for (var childIndex in control.children) {
        var child = control.children[childIndex];
        recursiveChildVisitor(child, action);
      }
    }
  }

  // Set all children recursively to not accept mouse events
  recursiveChildVisitor(control, function(c) {
    c.touchEnabled = false;
  });
  control.touchEnabled = true;
    
  // touch start
  control.addEventListener('touchstart', function(e) {
    eventInfo(e);
    e.source.touching = true;
    e.source.down = true;
    e.source.fireEvent('down');
  });

  // touch move
  control.addEventListener('touchmove', function(e) {
    eventInfo(e);
    if (withinBounds(e)) {
      if (!e.source.down) {
        e.source.down = true;
        e.source.fireEvent('down');
      }
    }
    else {
      if (e.source.down) {
        e.source.down = false;
        e.source.fireEvent('up');
      }
    }
  })

  // touch end
  control.addEventListener('touchend', function(e) {
    eventInfo(e);
    e.source.touching = false;
    if (withinBounds(e)) {
      e.source.fireEvent('press');
    }

    e.source.down = false;
    e.source.fireEvent('up');
  })

  // touch cancel
  control.addEventListener('touchcancel', function(e) {
    eventInfo(e);
    e.source.touching = false;
    e.source.down = false;
    e.source.fireEvent('up');
  })

  recursiveChildVisitor(control, function(c) {
    c.colorUp = c.color;
  });
  control.backgroundColorUp = control.backgroundColor;
  control.backgroundImageUp = control.backgroundImage;
  
  control.addEventListener('down', function() {
    if (control.colorDown) {
      // Recursively set color to down color for all decendents
      recursiveChildVisitor(control, function(c) {
        c.color = control.colorDown;
      });
    }

    if (control.backgroundColorDown) {
      control.backgroundColor = control.backgroundColorDown;
    }
    
    if (control.backgroundImageDown) {
      control.backgroundImage = control.backgroundImageDown;
    }
  });
  
  control.addEventListener('up', function() {
    if (control.colorUp) {
      // Recursively reset color to original colors for each decendent
      recursiveChildVisitor(control, function(c) {
        c.color = c.colorUp;
      });
    }

    if (control.backgroundColorUp) {
      control.backgroundColor = control.backgroundColorUp;
    }
    
    if (control.backgroundImageUp) {
      control.backgroundImage = control.backgroundImageUp;
    }
  });

}
