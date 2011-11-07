Util.EventListener = new JS.Module({
  addEventListener: function(target, eventName, listener) {
    this.eventCache = this.eventCache || [];
    
    target.addEventListener(eventName, listener);
    this.eventCache.push({target: target, eventName: eventName, listener: listener});
  },
  
  removeEventListeners: function() {
    if (!this.eventCache)
      return;
    var events = this.eventCache;
    for (var i in events) {
      var e = events[i];
      e.target.removeEventListener(e.eventName, e.listener);
    }
  }
});

