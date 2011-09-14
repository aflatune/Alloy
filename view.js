var used = [Ti.UI.createWindow];

Alloy.View = new JS.Class({
  rendered: false,
  
  initialize: function(partial) {
    if (partial) {
      this.view = new View();
    }
    else {
      this.view = this.window = new Window('viewWindow');
    }
  },
  
  render: function() {
    this.rendered = true;
  },
  
  dataReady: function(data, params) {
  }
});
