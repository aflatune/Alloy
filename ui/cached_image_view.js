Alloy.UI.CachedImageView = new JS.Class({
  extend: {
    CachePolicy: {
      Disabled: 1,        // No caching, i.e. fetch directly from url, no offline support -- same as normal ImageView
      OfflineOnly: 2,     // Use cached image only when offline. When online, fetch from url and store in cache.
      CacheAndServe: 3},  // If cache hit, do not fetch again from url. Useful when images are immutable on server.
  },

  initialize: function(params) {
    this.imageView = new ImageView(params);
    this.cachePolicy = Alloy.UI.CachedImageView.CachePolicy.CacheAndServe;
    
    // Cache write
    var _this = this;
    this.imageView.addEventListener("load", function(e) {
      if (_this.cachePolicy == Alloy.UI.CachedImageView.CachePolicy.Disabled)
        return;
        
      var filename = _this.urlToFilename(e.source.image);
      if (filename) {
         
        var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "cache/" + filename /*e.source.image*/);
        if (!f.exists() || 
           (_this.cachePolicy == Alloy.UI.CachedImageView.CachePolicy.OfflineOnly)) {
          // Make sure the directory exists
          var dir = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "cache");
          dir.createDirectory();
          
          // Write out the file
          var imageData = e.source.toImage();
          f.write(imageData);
        }
      }
    });
  },
  
  // Cache read
  setImage: function(url) {
    if (this.cachePolicy == Alloy.UI.CachedImageView.CachePolicy.Disabled ||
       (this.cachePolicy == Alloy.UI.CachedImageView.CachePolicy.OfflineOnly && Ti.Network.online)) {
      this.imageView.image = url;
      return;
    }
    
    var filename = this.urlToFilename(url);
    if (filename) {
      var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "cache/" + filename);
      if (f.exists()) {
        this.imageView.image = f.read();
      }
      else {
        this.imageView.image = url;
      }
    }    
  },
  
  urlToFilename: function(url) {
    // When url is NSUrl
    if(typeof(url) == 'object') url = url.absoluteString;
    
    // When url is TiBlob
    if (url == null) return null;
    
    return url.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/\-([a-z]+)$/, '.$1');
  }
});
