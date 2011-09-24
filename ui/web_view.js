var used = [Ti.UI.createWebView, Ti.UI.createToolbar];

Alloy.UI.WebView = new JS.Class(Alloy.View, {
  extend: {
    show: function(url) {
      var wv = new Alloy.UI.WebView();
      wv.render(url);
      
      wv.scalesPageToFit = true;
      wv.window.open({animated: true, transition: Ti.UI.iPhone.AnimationStyle.CURL_UP});
    }
  },
  
  initialize: function() {
    this.callSuper();
    this.name = 'web_view';
  },

  analyticsPageUrl: function() {
    return this.name + '?url=' + this.url;
  },
  
  render: function(url) {
    this.url = url;
    this.window.backgroundColor = '#222';

    // Webview
    var webView = new WebView({url: url, top:45, bottom:0});
    this.window.add(webView);

    // Back button with toolbar
    var _this = this;
    var backButton = new Button({
      title : 'Back',
      className: 'toolbarButton'
    });
    
    var toolbar = new Toolbar({
      items:[backButton],
      zIndex: 100
    });

    this.window.add(toolbar);

    // Attach toolbar button events after window loads
    // http://developer.appcelerator.com/question/125494/inexplicable-bug-toolbar-button-only-listens-4-clicks
    this.window.addEventListener("open", function(e) {
      // Prevent multiple invocation when the same window is closed and opend multiple times
      if (_this.toolbarButtonEventsAttached)
        return;
      
      this.toolbarButtonEventsAttached = true;  
      backButton.addEventListener('click', function(e) {
        _this.window.close({animated: true});
      });
    });

  }
})
