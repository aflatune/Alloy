Alloy.UI.TableViewDynamicUpdate = function(tableView, color, maxRows) {
  if (typeof(maxRows) == 'undefined') maxRows = 100;
  
	var updating = false;
	var loadingText = "Loading...";
	var loadingRow = Ti.UI.createTableViewRow({title:loadingText, color: color});

	tableView.endUpdate = function()
	{
		updating = false;
    var deletedRows = Alloy.UI.deleteRow(tableView, function(row) {
      return (row.title == loadingText);
    });
    
		// just scroll down a bit to the new rows to bring them into view
		//if (deletedRows.length > 0)
  	//	tableView.scrollToIndex(deletedRows[0],{animated:true,position:Ti.UI.iPhone.TableViewScrollPosition.BOTTOM});
	}

	var lastDistance = 0; // calculate location to determine direction

	tableView.addEventListener('scroll',function(e)
	{
	  if (tableView.data.length == 0)
	     return;
	   
	  var rows = tableView.data[0].rowCount;
	  if (tableView.data[0].rowCount >= maxRows)
	   return;
	   
		var offset = e.contentOffset.y;
		var height = e.size.height;
		var total = offset + height;
		var theEnd = e.contentSize.height;
		var distance = theEnd - total;

		// going down is the only time we dynamically load,
		// going up we can safely ignore -- note here that
		// the values will be negative so we do the opposite
		if (distance < lastDistance)
		{
			// adjust the % of rows scrolled before we decide to start fetching
			var nearEnd = theEnd - 100; //theEnd * .75;

			if (!updating && (total >= nearEnd))
			{
				updating = true;
				tableView.appendRow(loadingRow);
				
				tableView.beginUpdate();
			}
		}
		lastDistance = distance;
	});
}