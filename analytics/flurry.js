Alloy.analytics = new JS.Singleton(Alloy.AnalyticsBase, {
  initialize: function() {
    // requires ti.flurry module
    this.analytics = require("ti.flurry");    
    this.callSuper();
  },
  
  start: function(dispatchPeriod){
    this.callSuper();
    this.analytics.initialize(AlloyConfig.analytics.key, true);
  }, 
  
  stop: function(){
    this.callSuper();
  }, 
  
  trackPageview: function(pageUrl){
    this.callSuper();
    this.analytics.logEvent('pageview', {url: pageUrl});
  },
  
  trackEvent: function(category, action, label, value){
    this.callSuper();
    this.analytics.logEvent(category + ':' + action, {label: label, value: value});
  },
  
  reset:function(){
    this.callSuper();
  }
})

