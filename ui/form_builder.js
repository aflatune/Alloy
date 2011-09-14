Alloy.UI.FormBuilder = new JS.Class({
  initialize: function(window) {
    this.window = window;
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
  
  createTextField : function(height, labelText, hintText, text, keyboardType, returnKeyType) {
    var row = this.createRow(height);

    var left, width;

    if(labelText) {
      var label = new Label({
        top : 0,
        left : '4%',
        width : '36%',
        height : height,
        text : labelText
      });
        
      row.add(label); 
      left = '40%';
      width = '56%';
    }
    else { 
      left = '4%';
      width = '96%';
    }

    var textField = new TextField({
      top : 4,
      left : left,
      width : width,
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
