var used = [Ti.UI.createPicker, Ti.UI.createPickerColumn, Ti.UI.createPickerRow];

Alloy.UI.PickerView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper();
    //this.window.backgroundColor = 'stripped';
    //this.window.modal = false;
    //this.window.navBarHidden = true;
    this.name = 'picker';
    var picker = Ti.UI.createPicker({top: 0, selectionIndicator: true});
    this.picker = picker;
    
    this.view.add(picker);
  },
  
  render: function(title, items /* array of arrays of strings*/, infoLineFormat, initialValues) {
    this.window.title = title;
    this.title = title;
    this.infoLineFormat = infoLineFormat;
    var _this = this;
    
    this.picker.addEventListener('change', function(e) {
      _this.selectedValue = e.selectedValue || _this.picker.value;
      _this.updateInfoLine();
      _this.picker.fireEvent('app:picker_view:change', {pickerView: _this, columnIndex: e.columnIndex, rowIndex: e.rowIndex, selectedValue: _this.selectedValue});

      if (_this.autoCommit) {
         _this.picker.fireEvent('app:picker_view:done', {pickerView: _this, selectedValue: _this.selectedValue});       
      }
    });
    
    var columns = [];
    
    // If items is a hash, it indicates a builtin picker type (e.g. date)
    if (typeof(items) == 'object' && items.type) {
      this.picker.type = items.type;
      if (items.minDate)
        this.picker.minDate = items.minDate;   
      _this.picker.value = initialValues;   
    }
    // Otherwise this is a custom picker. items is 2d array with columns and row values
    else {
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
      this.window.addEventListener('open', function() {
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
      });
    }
    
    _this.selectedValue = [];
        
    // Info line
    this.infoLine = new Label({color: '#000', textAlign: 'center', left: 8, right: 8, top: 224, height: 57, font: {fontSize: 19, fontWeight: 'bold'}});
    this.view.add(this.infoLine);
    this.updateInfoLine();
    
    // Nav bar buttons
    if (!_this.nav) {
      var cancelButton = new Button({
        title : _this.autoCommit ? 'Close' : 'Cancel',
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
      });
      cancelButton.addEventListener('click', function(e) {
        _this.close({animated: true});
      })
      
      this.window.leftNavButton = cancelButton;      
    }
    
    // Present a done (i.e. save) button unless we want to auto commit changes
    if (!_this.autoCommit) {
      var doneButton = new Button({
        title : 'Done',
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
      });
      
      doneButton.addEventListener('click', function(e) {
        _this.picker.fireEvent('app:picker_view:done', {pickerView: _this, selectedValue: _this.selectedValue});
        if (_this.nav)
          _this.nav.close(_this.window);
        else
          _this.window.close();
      })
      this.window.rightNavButton = doneButton;
    }
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
