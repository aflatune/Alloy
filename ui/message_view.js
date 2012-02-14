var used = [Ti.UI.createTextArea];

Alloy.UI.MessageView = new JS.Class(Alloy.View, {
  extend: {
    Align: {
      Left: 'left',
      Right: 'right'
    },
    
    Color: {
      White: 'grey',
      Blue: 'blue',
      Pink: 'pink'
    }
  },
  
  initialize: function() {
    this.callSuper();
    this.name = "message";
  },
  
  render: function() {
    this.rowCount = 0;
    var layoutTableContainer = new View();
    var layoutTable = new TableView('layoutTable');
    //layoutTable.backgroundImage = '/public/images/app/classy_fabric.png';
    
    layoutTableContainer.bottom = 40;
    layoutTableContainer.add(layoutTable);
     
    this.messagesTable = layoutTable;
    this.view.add(layoutTableContainer);   
  
    // Controls toolbar
    var controls = new View('messageViewControls');
    this.controls = controls;
    var controlsBG = new Label('messageViewControlsBG');
    controls.add(controlsBG);
    controls.bottom = 0;
    
    var _this = this;
    // Textbox
    var textboxContainer = new Label('messageViewTextboxContainer');
    this.textboxContainer = textboxContainer;
    var textbox = new TextArea('messageViewTextbox');
    this.textbox = textbox;
    textbox.addEventListener('focus', function(e) {
      var a = new Animation();
      a.bottom = 216;
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
    this.textbox = textbox;

    var textboxSizer = new Label('messageViewTextboxSizer');
    this.textboxSizer = textboxSizer;
    this.view.add(textboxSizer);
    textbox.addEventListener('change', function(e){
      textboxSizer.text = e.value;
      setTimeout(function() {
        info("textboxSizer.height " + textboxSizer.height);
        var h = textboxSizer.height;
        if (h < 4) h = 4;
        if (h > 54) h = 54;
        
        h += 36;
        if (controls.height != h) {
          controls.height = h;
          layoutTableContainer.bottom = h;
        }
      }, 1);
    })

    // Button
    var sendButton = new Alloy.ImageButton({className: 'messageViewSendButton', title: 'Send'});
    this.sendButton = sendButton;
    controls.add(sendButton);
    
    this.view.add(controls);
    
    // Dismiss keyboard when clicked elsewhere
    layoutTable.addEventListener('singletap', function() {
      textbox.blur();
    })
  },
  
  reset: function() {
    this.messagesTable.setData([]);
    this.rowCount = 0;
  },
  
  addMessage: function(text, align, color, bold) {
    var row = new TableViewRow('layoutTableRow');
    
    var container = new View({left: 4, right: 4, top: 0, bottom: 8, height: 'auto'});
    row.add(container);
    
    if (!align) align = Alloy.UI.MessageView.Align.Left;
    if (!color) color = Alloy.UI.MessageView.Color.White;
    
    if (align == Alloy.UI.MessageView.Align.Left)
      container.right = 50;
    else
      container.left = 50;
      
    var balloon = new Label('balloon_' + align);
    balloon.backgroundImage = '/lib/alloy/ui/images/chat_bubbles/chat_bubble_' + align + '_' + color + '.png';
    balloon.text = text;
    if (bold)
      balloon.font = {fontSize: rjss.vars.fontLarge, fontWeight: 'bold'};
      
    container.add(balloon);
    this.tableData.push(row);
    if (!this.batchAddInProgress)
      this.messagesTable.appendRow(row);
    
    return this.rowCount++;
  },
  
  startBatchAdd: function() {
    this.tableData = [];
    this.batchAddInProgress = true;
  },
  
  endBatchAdd: function() {
    this.messagesTable.setData(this.tableData);
    this.batchAddInProgress = false;
  },
  
  addCustomRow: function(row) {
    if (this.batchAddInProgress)
      this.tableData.push(row);
    else
      this.messagesTable.appendRow(row);
    this.rowCount++;
  },
  
  scrollToIndex: function(index) {
    if (index == -1) index = this.rowCount - 1;
    
    this.messagesTable.scrollToIndex(index, {animated: false});
    this.messagesTable.bottom = this.messagesTable.bottom;
  }
})
