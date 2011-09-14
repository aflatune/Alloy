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
      rigthControl: {
        left: '4%',
        width: '56%'
      }
    };
        
    this.tableData = [];
  },
  
  createRow : function(height) {
    return new TableViewRow({
      height : height
    });
  },

  render: function() {
    var table = new TableView({data:this.tableData, style:Titanium.UI.iPhone.TableViewStyle.GROUPED});
    this.window.add(table);
  },

  createButton : function(height, title) {
    var row = this.createRow();
    row.height = height;
    row.add(new Label({
      text: title, 
      width: '100%', 
      font: {fontSize: 14, fontWeight: 'bold'},
      textAlign: 'center',
      top: 0
    }));
    thiscurrentSection().add(row);
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
  },
  
  createTextField : function(height, labelText, hintText, text, keyboardType, returnKeyType) {
    var row = this.createRow(height);

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
      clearButtonMode : Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
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
  
  currentSection: function() {
    if (this.tableData.length == 0)
      this.startNewSection();
      
    return this.tableData[this.tableData.length-1];
  },
  
  startNewSection: function() {
    this.tableData[this.tableData.length] = Ti.UI.createTableViewSection();
  }
})
