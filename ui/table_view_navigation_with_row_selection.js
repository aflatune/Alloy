Alloy.UI.enableTableViewNavigationWithRowSelection = function(tableView, ownerWindow) {
  Alloy.UI.enableRowSelectionEvents(tableView);
  Alloy.UI.adjustColorsOnRowSelection(tableView, '#fff'); 
  
  ownerWindow.addEventListener('focus', function() {
    if (tableView && typeof(tableView.selectedRowIndex) != 'undefined') {
      tableView.deselectRow(tableView.selectedRowIndex);
      tableView.fireEvent('rowDeselected', {index: tableView.selectedRowIndex, row: tableView.selectedRow});
      tableView.selectedRowIndex = null;
    }
  })
}

