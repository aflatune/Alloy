var used = [Titanium.UI.createSwitch, Titanium.UI.createTextArea, Titanium.UI.iPhone.TableViewStyle.GROUPED, Titanium.UI.iPhone.TableViewCellSelectionStyle.BLUE];

Alloy.UI.FormBuilder = new JS.Class({
  initialize: function(view, alloyView) {
    this.view = view;
    this.alloyView = alloyView;
    this.rowCount = 0;
    this.tableData = [];
  },
  
  createRow : function() {
    this.rowCount++;
    var row = new TableViewRow('formBuilderTableRow');
    
    return row;
  },

  render: function() {
    this.tableView = new TableView('formBuilderTable');
    Alloy.UI.enableTableViewNavigationWithRowSelection(this.tableView, this.alloyView.window);
     
    this.tableView.data = this.tableData;
    this.view.add(this.tableView);
    return this.tableView;
  },

  createButton : function(title, color, backgroundColor) {
    var row = this.createRow();
    if (backgroundColor)
      row.backgroundColor = backgroundColor;
    row.add(new Label({
      className: 'formBuilderControl formBuilderButtonLabel',
      text: title, 
      color: color || '#000'
    }));
    this.currentSection().add(row);
    
    return row;
  },
  
  createLabel: function(text) {
    var row = this.createRow();
    row.height = 'auto';
    
    row.hasChild = true;
    var label = new Label({
      className: 'formBuilderControl formBuilderLabel',
      text: text
    });
    row.add(label);
    this.currentSection().add(row);
    
    return ({row: row, label: label});
  },
  
  _addSplitRowLabel: function(row, labelText) {
    var label = new Label({
      className: 'formBuilderControl formBuilderSplitRowLeftControl',
      text : labelText
    });
      
    row.add(label); 
    return label;
  },

  createTextField : function(labelText, hintText, text, keyboardType, returnKeyType, backgroundColor) {
    var row = this.createRow();
    row.selectionStyle = Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE;
    if (backgroundColor)
      row.backgroundColor = backgroundColor;
      
    var className;

    if(labelText) {
      this._addSplitRowLabel(row, labelText);
      className = 'formBuilderControl formBuilderSplitRowRightControl';
    }
    else { 
      className = 'formBuilderControl formBuilderLabel';
    }

    var textField = new TextField({
      className: className,
      top : 4,
      borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText : hintText,
      clearButtonMode : Ti.UI.INPUT_BUTTONMODE_ALWAYS,
      value : text
    });

    if (keyboardType)
      textField.keyboardType = keyboardType;
      
    if (returnKeyType)
      textField.returnKeyType = returnKeyType;

    row.add(textField);

    this.currentSection().add(row);

    return textField;
  },

  createSwitch: function(label, value) {
    var row = this.createRow();
    row.allowsSelection = false;
    var leftControl = this._addSplitRowLabel(row, label);
    row.add(leftControl);
    
    var rightControl = new Switch({
      className: 'formBuilderControl formBuilderSplitRowRightControl formBuilderSwitch',
      value: value      
    });
    row.add(rightControl);
    this.currentSection().add(row);
    
    return ({row:row, leftControl:leftControl, rightControl:rightControl});
  },
  
  createSplitRowLabels : function(label1Text, label2Text) {
    var row = this.createRow();
    var label1 = this._addSplitRowLabel(row, label1Text);
    row.add(label1);
    
    var label2 = new Label({
      className: 'formBuilderControl formBuilderSplitRowRightControl',
      text : label2Text
    });
    info("label2 " + JSON.stringify(label2.font));
    row.add(label2);

    this.currentSection().add(row);

    return ({row:row, leftControl:label1, rightControl:label2});
  },
  
  currentSection: function() {
    if (this.tableData.length == 0)
      this.startNewSection();
      
    return this.tableData[this.tableData.length-1];
  },
  
  startNewSection: function(title) {
    var section = Ti.UI.createTableViewSection();
    section.headerTitle = title;
    this.tableData[this.tableData.length] = section;
    return section;
  }
})
