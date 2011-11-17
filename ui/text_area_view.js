var used = [Ti.UI.createTextArea];

Alloy.UI.TextAreaView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper();
    //this.window.backgroundColor = 'stripped';

    this.name = 'text_area';
    var textArea = new TextArea('textAreaViewControl');
    this.textArea = textArea;
    this.textArea.suppressReturn = false;
    
    this.view.add(textArea);
    
    var _this = this;
    this.addEventListener(this.window, 'open', function() {
      _this.textArea.focus();
    })
  },
  
  render: function(title, initialValue) {
    this.window.title = title;
    this.title = title;
    this.textArea.value = initialValue;
    this.value = initialValue;
    
    var _this = this;
    // Nav bar buttons
    if (!_this.nav) {
      var cancelButton = new Alloy.ImageButton({
        title : _this.autoCommit ? 'Close' : 'Cancel',
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
      });
      cancelButton.addEventListener('press', function(e) {
        if (_this.nav)
          _this.nav.close(_this.window);
        else
          _this.window.close();
      })
      
      this.window.leftNavButton = cancelButton;      
    }

    this.textArea.addEventListener('change', function(e) {
      _this.value = _this.textArea.value;

      if (_this.autoCommit) {
        _this.textArea.fireEvent('app:text_area_view:done', {textAreaView: _this, value: _this.value});
      }
    });
    
    // Present a done (i.e. save) button unless we want to auto commit changes
    if (!_this.autoCommit) {
      var doneButton = new Alloy.ImageButton({
        title : 'Done',
        style: Ti.UI.iPhone.SystemButtonStyle.DONE
      });
      
      doneButton.addEventListener('press', function(e) {
        _this.textArea.fireEvent('app:text_area_view:done', {textAreaView: _this, value: _this.value});
        if (_this.nav)
          _this.nav.close(_this.window);
        else
          _this.window.close();
      })
      this.window.rightNavButton = doneButton;
    }
  },
  
  analyticsPageUrl: function() {
    return 'text_area?title=' + this.window.title;
  }
});
