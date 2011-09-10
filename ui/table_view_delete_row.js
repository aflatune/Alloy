Alloy.UI.deleteRow = function(tableView, block) {
  var rowsToDelete = [];
  var rowIndex = 0;
  for (var i in tableView.data) {
      var section = tableView.data[i];
      for (var j in section.rows) {
          var row = section.rows[j];
          if(block(row)){
            rowsToDelete.push(rowIndex);
          }
          rowIndex++;
      }
  }

  for (var rowToDelete = rowsToDelete.length - 1; rowToDelete >= 0; rowToDelete--) {
    tableView.deleteRow(rowsToDelete[rowToDelete]);
  }

  return rowsToDelete;
}
