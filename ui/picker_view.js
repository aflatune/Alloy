var used = [Ti.UI.createPicker, Ti.UI.createPickerColumn, Ti.UI.createPickerRow];

Alloy.UI.PickerView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper();
    this.window.backgroundColor = 'stripped';
    this.name = 'picker';
    var picker = Ti.UI.createPicker({top: 0, selectionIndicator: true});
    this.picker = picker;
    this.window.add(picker);
  },
  
  render: function(title, items /* array of arrays of string*/, infoLineFormat, onSelectionCallback, onDoneCallback, initialValues) {
    this.window.title = title;
    this.infoLineFormat = infoLineFormat;
    var _this = this;
    
    this.picker.addEventListener('change', function(e) {
      _this.selectedValue = e.selectedValue;
      _this.updateInfoLine();
      onSelectionCallback(_this, e.columnIndex, e.rowIndex, e.selectedValue);
    });
    
    var columns = [];
    
    // Create all columns and rows
    for (var columnIndex in items) {
      var column = Ti.UI.createPickerColumn();
      
      for (var itemIndex in items[columnIndex]) {
        column.addRow(Ti.UI.createPickerRow({title:items[columnIndex][itemIndex]}));
      }
      columns.push(column);
    }

    this.picker.add(columns);

    // Select specified items or first items in all columns
    setTimeout(function(){
      if (initialValues && initialValues.length > 0) {
        var columnIndex = 0;
        for (var i in initialValues) {
          var initialValueIndex = items[columnIndex].indexOf(initialValues[i]);
          _this.picker.setSelectedRow(columnIndex, initialValueIndex, true);
          info("selecting column " + columnIndex + " row " + initialValueIndex);
          columnIndex++;
        }
      }
      else {
        for (var columnIndex in items) {
          _this.selectedValue.push(items[columnIndex][0]);
          _this.picker.setSelectedRow(columnIndex, 0, false);
        }
      }      
    }, 1);
    _this.selectedValue = [];
        
    // Info line
    this.infoLine = new Label({color: '#000', textAlign: 'center', left: 8, right: 8, top: 224, height: 57, font: {fontSize: 19, fontWeight: 'bold'}});
    this.window.add(this.infoLine);
    this.updateInfoLine();
    
    // Nav bar buttons
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
      onDoneCallback(_this.window.title, _this.selectedValue);
      _this.window.close();
    })
    this.window.rightNavButton = doneButton;
  },
  
  updateInfoLine: function() {
    if (typeof(this.infoLineFormat) == 'string') {
      var message = this.infoLineFormat;
      message = message.replace(/\{title\}/g, this.window.title);
      for (var index in this.selectedValue) {
        message = message.replace('{' + index + '}', this.selectedValue[index]);
      }
      
      this.infoLine.text = message;
    }
    else if  (typeof(this.infoLineFormat) == 'function') {
      message = this.infoLineFormat(this.selectedValue);
      this.infoLine.text = message;
    }
  },
  
  analyticsPageUrl: function() {
    return 'picker?title=' + this.window.title;
  }
});
