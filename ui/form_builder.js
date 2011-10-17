var used = [Titanium.UI.createSwitch, Titanium.UI.createTextArea];

Alloy.UI.FormBuilder = new JS.Class({
  initialize: function(view) {
    this.view = view;

    this.simpleRowConfig = {
      control: {
        left: '4%',
        width: '96%',
        className: 'formBuilderSimpleRowControl'
      }
    },
    
    this.splitRowConfig = {
      leftControl: {
        left: '4%',
        width: '36%',
        className: 'formBuilderSplitRowLeftControl'
      },
      rightControl: {
        left: '40%',
        width: '56%',
        className: 'formBuilderSplitRowRightControl'
      }
    };
        
    this.tableData = [];
  },
  
  createRow : function(height) {
    return Ti.UI.createTableViewRow({
      height : height,
      allowsSelection:false,
      separatorStyle: 0
    });
  },

  render: function() {
    this.tableView = Ti.UI.createTableView({data:this.tableData, style:Titanium.UI.iPhone.TableViewStyle.GROUPED});
    this.view.add(this.tableView);
    return this.tableView;
  },

  createButton : function(height, title, color, backgroundColor) {
    var row = this.createRow();
    if (backgroundColor)
      row.backgroundColor = backgroundColor;
    row.height = height;
    row.add(new Label({
      text: title, 
      width: '100%', 
      font: {fontSize: 14, fontWeight: 'bold'},
      textAlign: 'center',
      top: 0,
      color: color
    }));
    this.currentSection().add(row);
    
    return row;
  },
  
  createLabel: function(text) {
    var row = this.createRow();
    row.height = 'auto';
    
    row.hasChild = true;
    var label = new Label({
      text: text, 
      font: {fontSize: 14},
      textAlign: 'left',
      left: 8,
      right: 8,
      height: 40
    });
    row.add(label);
    this.currentSection().add(row);
    
    return ({row: row, label: label});
  },
  
  _addSplitRowLabel: function(row, labelText, height) {
    var label = new Label({
      className: this.splitRowConfig.leftControl.className,
      top : 0,
      left : this.splitRowConfig.leftControl.left,
      width : this.splitRowConfig.leftControl.width,
      height : height,
      text : labelText
    });
      
    row.add(label); 
    return label;
  },

  createTextField : function(height, labelText, hintText, text, keyboardType, returnKeyType, backgroundColor) {
    return this.createTextFieldInternal(true, height, labelText, hintText, text, keyboardType, returnKeyType, backgroundColor);
  },

  createTextArea : function(height, labelText, hintText, text, keyboardType, returnKeyType, backgroundColor) {
    return this.createTextFieldInternal(false, height, labelText, hintText, text, keyboardType, returnKeyType, backgroundColor);
  },
    
  createTextFieldInternal : function(textFieldType, height, labelText, hintText, text, keyboardType, returnKeyType, backgroundColor) {
    var row = this.createRow(height);
    if (backgroundColor)
      row.backgroundColor = backgroundColor;
      
    var textFieldConfig;

    if(labelText) {
      this._addSplitRowLabel(row, labelText, height);
      textFieldConfig = this.splitRowConfig.rightControl;
    }
    else { 
      textFieldConfig = this.simpleRowConfig.control;
    }

    var textControl = textFieldType ? TextField : TextArea;
    
    var textField = new textControl({
      className: this.splitRowConfig.rightControl.className,
      top : 4,
      left : textFieldConfig.left,
      width : textFieldConfig.width,
      height : height - 8,
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

  createSwitch: function(height, label, value) {
    var row = this.createRow(height);
    var leftControl = this._addSplitRowLabel(row, label, height);
    row.add(leftControl);
    
    var rightControl = new Switch({
      className: this.splitRowConfig.rightControl.className,
      right: this.splitRowConfig.leftControl.left,
      value: value      
    });
    row.add(rightControl);
    this.currentSection().add(row);
    
    return ({row:row, leftControl:leftControl, rightControl:rightControl});
  },
  
  createSplitRowLabels : function(height, label1Text, label2Text) {
    var row = this.createRow(height);
    var label1 = this._addSplitRowLabel(row, label1Text, height);
    row.add(label1);
    
    var label2 = new Label({
      className: this.splitRowConfig.rightControl.className,
      left : this.splitRowConfig.rightControl.left,
      width : this.splitRowConfig.rightControl.width,
      text : label2Text
    });
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
