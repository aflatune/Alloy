Util = {};
Ti.include('string.js');
Ti.include('event.js');

Util.Hash = {
  keys: function(o){
     var ret=[],p;
     for(p in o) ret.push(p);
     return ret;
  },
  
  values: function(o){
     var ret=[],p;
     for(p in o) ret.push(o[p]);
     return ret;
  },
  
  transpose: function(o) {
     var ret={},p;
     for(p in o) ret[o[p]] = p;
     return ret;
  }
  
};

