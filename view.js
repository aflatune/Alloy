var used = [Ti.UI.createWindow];

Alloy.View = new JS.Class({
  rendered: false,
  
  initialize: function(partial) {
    if (partial) {
      this.view = new View();
    }
    else {
      this.view = this.window = Ti.UI.createWindow();
      $(this.window).applyStyle('Window', { className: 'viewWindow' });
      var _this = this;
      this.window.addEventListener('focus', function() {
        _this.trackViewShowEvent();
      });
    }
  },
  
  analyticsPageUrl: function() {
    return (this.name || '(anonymous)');
  },
  
  trackViewShowEvent: function() {
    Alloy.analytics.trackPageview('/' + this.analyticsPageUrl());
  },
  
  render: function() {
    this.rendered = true;
  }
});
