var used = [Titanium.UI.createSwitch];

Alloy.UI.FormBuilder = new JS.Class({
  initialize: function(window) {
    this.window = window;

    this.simpleRowConfig = {
      control: {
        left: '4%',
        width: '96%'
      }
    },
    
    this.splitRowConfig = {
      leftControl: {
        left: '4%',
        width: '36%'
      },
      rightControl: {
        left: '40%',
        width: '56%'
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
    this.window.add(this.tableView);
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
  
  _addSplitRowLabel: function(row, labelText, height) {
    var label = new Label({
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

    var textField = new TextField({
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
  
  startNewSection: function() {
    this.tableData[this.tableData.length] = Ti.UI.createTableViewSection();
  }
})
