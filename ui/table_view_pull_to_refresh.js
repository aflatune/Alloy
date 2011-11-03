Alloy.UI.TableViewPullToRefresh = function(tableView, backgroundColor, color, borderColor) {
  if (typeof(backgroundColor) == 'undefined') backgroundColor = "#e2e7ed";
  if (typeof(color) == 'undefined') color = "#576c89";
  if (typeof(borderColor) == 'undefined') borderColor = color;
  
  function formatDate(){
    var date = new Date();
    return date.toString('MMMM d, h:mmtt');
  }
  
  var border = Ti.UI.createView({
    backgroundColor:borderColor,
    height:2,
    bottom:0
  });
  
  var tableHeader = Ti.UI.createView({
    backgroundColor:backgroundColor,
    width:320,
    height:60
  });
  
  // fake it til ya make it..  create a 2 pixel
  // bottom border
  tableHeader.add(border);
  
  var arrow = Ti.UI.createView({
    backgroundImage:"../images/whiteArrow.png",
    width:23,
    height:60,
    bottom:10,
    left:20
  });
  
  var statusLabel = Ti.UI.createLabel({
    text:"Pull to reload",
    left:55,
    width:200,
    bottom:30,
    height:"auto",
    color:color,
    textAlign:"center",
    font:{fontSize:rjss.vars.fontSizeSmall,fontWeight:"bold"},
    shadowColor:"#fff",
    shadowOffset:{x:0,y:1}
  });
  
  var lastUpdatedLabel = Ti.UI.createLabel({
    text:"Last Updated: "+formatDate(),
    left:55,
    width:200,
    bottom:15,
    height:"auto",
    color:color,
    textAlign:"center",
    font:{fontSize:rjss.vars.fontSizeXSmall},
    shadowColor:"#fff",
    shadowOffset:{x:0,y:1}
  });
  
  var actInd = Titanium.UI.createActivityIndicator({
    left:20,
    bottom:13,
    width:30,
    height:30
  });
  
  tableHeader.add(arrow);
  tableHeader.add(statusLabel);
  tableHeader.add(lastUpdatedLabel);
  tableHeader.add(actInd);
  
  tableView.headerPullView = tableHeader;
  
  
  var pulling = false;
  var reloading = false;
  
  tableView.beginReloading = function() {
    info("**** Implement tableView.beginReloading and call tableView.endReloading when done reloading ****");
    tableView.endReloading();
  }
  
  tableView.endReloading = function() {
    // when you're done, just reset
    tableView.setContentInsets({top:0},{animated:true});
    reloading = false;
    lastUpdatedLabel.text = "Last Updated: "+formatDate();
    statusLabel.text = "Pull down to refresh...";
    actInd.hide();
    arrow.show();
  }
  
  tableView.addEventListener('scroll',function(e)
  {
    var offset = e.contentOffset.y;
    if (offset <= -65.0 && !pulling)
    {
      var t = Ti.UI.create2DMatrix();
      t = t.rotate(-180);
      pulling = true;
      arrow.animate({transform:t,duration:180});
      statusLabel.text = "Release to refresh...";
    }
    else if (pulling && offset > -65.0 && offset < 0)
    {
      pulling = false;
      var t = Ti.UI.create2DMatrix();
      arrow.animate({transform:t,duration:180});
      statusLabel.text = "Pull down to refresh...";
    }
  });
  
  tableView.addEventListener('scrollEnd',function(e)
  {
    if (pulling && !reloading && e.contentOffset.y <= -65.0)
    {
      reloading = true;
      pulling = false;
      arrow.hide();
      actInd.show();
      statusLabel.text = "Reloading...";
      tableView.setContentInsets({top:60},{animated:true});
      arrow.transform=Ti.UI.create2DMatrix();
      tableView.beginReloading();
    }
  });

}
