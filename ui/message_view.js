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
    textbox.addEventListener('focus', function(e) {
      var a = new Animation();
      a.bottom = 166;
      _this.view.animate(a);
    });
    
    textbox.addEventListener('blur', function(e) {
      var a = new Animation();
      a.bottom = 0;
      _this.view.animate(a);
    });
    controls.add(textboxContainer);
    controls.add(textbox);
    
    // Button
    var sendButton = new Button('messageViewSendButton');
    controls.add(sendButton);
    
    this.view.add(controls);
    
    this.addMessage("What's up?", Alloy.UI.MessageView.Align.Left);
    this.addMessage("Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! Building this awesome iPhone app for Cupidtino.. It is going to be magical! ", Alloy.UI.MessageView.Align.Right, Alloy.UI.MessageView.Color.Blue);
    this.addMessage("What's up?", Alloy.UI.MessageView.Align.Right);

    // Dismiss keyboard when clicked elsewhere
    layoutTable.addEventListener('click', function() {
      textbox.blur();
    })
  },
  
  addMessage: function(text, align, color) {
    var row = new TableViewRow('layoutTableRow');
    
    var container = new View({left: 0, right: 0, top: 8, bottom: 8, height: 'auto'});
    row.add(container);
    
    if (!align) align = Alloy.UI.MessageView.Align.Left;
    if (!color) color = Alloy.UI.MessageView.Color.White;
    
    var balloon = new Label('balloon' + align);
    balloon.backgroundImage = '/lib/alloy/ui/images/' + color + 'Balloon' + align + '.png';
    balloon.text = text;
    container.add(balloon);
    this.messagesTable.appendRow(row);
  }
})
