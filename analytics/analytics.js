Alloy.AnalyticsBase = new JS.Class({
  initialize: function() {
    this.start(60);
  },
  
  start: function(dispatchPeriod){
    info('alloy:analytics:start');
  }, 
  
  stop: function(){
    info('alloy:analytics:stop');
  }, 
  
  trackPageview: function(pageUrl){
    info('alloy:analytics:trackPageview ' + pageUrl);
  },
  
  trackEvent: function(category, action, label, value){
    info('alloy:analytics:trackEvent - ' + category + ', ' + action + ', ' + label + ', ' + value);
  },
  
  reset:function(){
    info('alloy:analytics:reset');
  }
})

