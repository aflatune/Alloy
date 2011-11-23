var used = [Ti.UI.createWebView, Ti.UI.createToolbar];

Alloy.UI.WebView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper();
    this.name = 'web_view';
  },

  analyticsPageUrl: function() {
    return this.name + '?url=' + this.url;
  },
  
  render: function(url) {
    this.callSuper();
    
    // Webview
    var webView = new WebView({url: url});
    webView.scalesPageToFit = true;
    this.view.add(webView);
  }
})
