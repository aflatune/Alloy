String.prototype.toCamelCase = function() {
  return this.toString()
    .replace(/([A-Z]+)/g, function(m,l){
      return l.substr(0,1).toUpperCase() + l.toLowerCase().substr(1,l.length);
    })
    .replace(/[\-_\s](.)/g, function(m, l){
      return l.toUpperCase();
    });
};

String.prototype.toPascalCase = function() {
  return this.toString()
    .replace(/([a-zA-Z]+)/g, function(m,l){
      return l.substr(0,1).toUpperCase() + l.toLowerCase().substr(1,l.length);
    })
    .replace(/[\-_\s](.)/g, function(m, l){
      return l.toUpperCase();
    });
};

String.prototype.underscore = function() {
  return this.toString()
						 .replace(/::/g, '/')
             .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
             .replace(/([a-z\d])([A-Z])/g, '$1_$2')
             .replace(/-/g, '_')
             .toLowerCase();
}

String.prototype.dasherize = function() {
  return this.underscore().replace(/_/g, '-');
}

String.prototype.trim = function(chars) {
  return this.ltrim(this.rtrim(this.toString(), chars), chars);
}

String.prototype.ltrim = function(chars) {
  chars = chars || "\\s";
  return this.toString().replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
String.prototype.rtrim = function(chars) {
  chars = chars || "\\s";
  return this.toString().replace(new RegExp("[" + chars + "]+$", "g"), "");
}

String.prototype.isValidEmail = function() {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(this.toString());
}
