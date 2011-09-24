var used = [Ti.UI.createPicker, Ti.UI.createPickerColumn, Ti.UI.createPickerRow];

Alloy.UI.PickerView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper();
    this.window.backgroundColor = 'stripped';
    this.name = 'picker';
  },
  
  render: function(title, items /* array of arrays of string*/, onSelectionCallback, onDoneCallback) {
    this.window.title = title;
    
    var picker = Ti.UI.createPicker({top: 0, selectionIndicator: true});
    this.picker = picker;
    var columns = [];
    
    for (var columnIndex in items) {
      var column = Ti.UI.createPickerColumn();
      
      for (var itemIndex in items[columnIndex]) {
        column.addRow(Ti.UI.createPickerRow({title:items[columnIndex][itemIndex]}));
      }
      columns.push(column);
    }
    
    picker.add(columns);
    this.window.add(picker);
    
    // Nav bar buttons
    var _this = this;
    var cancelButton = new Button({
      title : 'Cancel'
    });
    cancelButton.addEventListener('click', function(e) {
      _this.window.close();
    })
    this.window.leftNavButton = cancelButton;

    var doneButton = new Button({
      title : 'Done',
      style: Ti.UI.iPhone.SystemButtonStyle.DONE
    });
    
    doneButton.addEventListener('click', function(e) {
      onDoneCallback(_this);
      _this.window.close();
    })
    this.window.rightNavButton = doneButton;
  }
});
