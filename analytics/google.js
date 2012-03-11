include('../extern/analytics.js');
Alloy.analyticsGoogle = new JS.Singleton(Alloy.AnalyticsBase, {
  initialize: function() {
    this.analytics = new Analytics(AlloyConfig.analytics.key);
    this.callSuper();
  },
  
  start: function(dispatchPeriod){
    this.callSuper();
    this.analytics.start(dispatchPeriod);
  }, 
  
  stop: function(){
    this.callSuper();
    this.analytics.stop();
  }, 
  
  trackPageview: function(pageUrl){
    this.callSuper();
    this.analytics.trackPageview(pageUrl);
  },
  
  trackEvent: function(category, action, label, value){
    this.callSuper();

    // Use page views instead of events till issue is fixed - https://github.com/rogchap/Titanium-Google-Analytics/issues/6
    //if (this.analytics) {
    //  this.analytics.trackEvent(category, action, label, value);
    //}
    
    var url = [];
    url.push('/event/');
    url.push(category.replace(/\:/g, '_'));
    url.push('/');
    url.push(action);
    
    var params = [];
    if (label) {
      params.push('label=');
      params.push(encodeURIComponent(label));
    }
    
    if (value) {
      if (params.length > 0)
        params.push('&');
      params.push('value=');
      params.push(encodeURIComponent(value));
    }
    
    if (params.length > 0) {
      url.push('?');
      url.push(params.join(''));
    }
    
    url = url.join('');
    this.trackPageview(url);
  },
  
  reset:function(){
    this.callSuper();
    this.analytics.reset();
  }
})

