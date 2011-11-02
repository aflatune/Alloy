var used = [Ti.UI.createScrollableView];

Alloy.UI.ImageGalleryView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper(true /* always a partial view */);
  },

  render: function(images, selected) {
    var views = [];
    for (var i in images) {
      var image = images[i];
      var container = new ScrollView({maxZoomScale: 3, bottom: 10})
      var imageView = new ImageView({image: image.photo_url, maxZoomScale: 3});
      container.add(imageView);
      views.push(container);
    }
    
    var scrollableView = new ScrollableView({
      views: views,
      showPagingControl:true,
      top: 0,
      left: 0,
      bottom: 10,
      right: 0
    });
    
    info("SELECTING " + selected);
    setTimeout(function() {
      scrollableView.scrollToView(selected);  
    }, 100);
    
    this.view.add(scrollableView);
  }
})
