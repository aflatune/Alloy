var used = [Ti.UI.createTextArea];

Alloy.UI.MessageView = new JS.Class(Alloy.View, {
  extend: {
    Align: {
      Left: 'Left',
      Right: 'Right'
    },
    
    Color: {
      White: 'White',
      Blue: 'Blue'
    }
  },
  
  initialize: function() {
    this.callSuper();
    this.name = "message";
  },
  
  render: function() {
    this.rowCount = 0;
    var layoutTable = new TableView('layoutTable');
    layoutTable.bottom = 80;
     
    this.messagesTable = layoutTable;
    this.view.add(layoutTable);   
  
    // Controls toolbar
    var controls = new View('messageViewControls');
    var controlsBG = new Label('messageViewControlsBG');
    controls.add(controlsBG);
    controls.bottom = 0;
    
    var _this = this;
    // Textbox
    var textboxContainer = new Label('messageViewTextboxContainer');
    var textbox = new TextArea('messageViewTextbox');
    this.textbox = textbox;
    textbox.addEventListener('focus', function(e) {
      var a = new Animation();
      a.bottom = 166;
      a.duration = 400;
      _this.view.animate(a);
      _this.scrollToIndex(_this.rowCount - 1);
    });
    
    textbox.addEventListener('blur', function(e) {
      var a = new Animation();
      a.bottom = 0;
      a.duration = 200;
      _this.view.animate(a);
    });
    controls.add(textboxContainer);
    controls.add(textbox);
    
    // Button
    var sendButton = new Button('messageViewSendButton');
    this.sendButton = sendButton;
    controls.add(sendButton);
    
    this.view.add(controls);
    
    // Dismiss keyboard when clicked elsewhere
    layoutTable.addEventListener('click', function() {
      textbox.blur();
    })
  },
  
  reset: function() {
    this.messagesTable.setData([]);
    this.rowCount = 0;
  },
  
  addMessage: function(text, align, color, bold) {
    var row = new TableViewRow('layoutTableRow');
    
    var container = new View({left: 4, right: 4, top: 8, bottom: 8, height: 'auto'});
    row.add(container);
    
    if (!align) align = Alloy.UI.MessageView.Align.Left;
    if (!color) color = Alloy.UI.MessageView.Color.White;
    
    var balloon = new Label('balloon' + align);
    balloon.backgroundImage = '/lib/alloy/ui/images/' + color + 'Balloon' + align + '.png';
    balloon.text = text;
    if (bold)
      balloon.font = {fontWeight: 'bold'};
      
    container.add(balloon);
    this.messagesTable.appendRow(row);
    
    return this.rowCount++;
  },
  
  scrollToIndex: function(index) {
    if (index == -1) index = this.rowCount - 1;
    
    this.messagesTable.scrollToIndex(index);
  }
})
