var used = [Ti.UI.createScrollableView];

Alloy.UI.ImageGalleryView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper(true /* always a partial view */);
    this.currentPage = 0;
  },

  render: function(params) {
    var _this = this;
    var images = params.images;
    var selected = params.selected;
    this.parentImageGallery = params.parentImageGallery;
    
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
      showPagingControl:(images.length > 1),
      top: 0,
      left: 0,
      bottom: 10,
      right: 0,
      pagingControlColor: 'transparent'
    });
    this.scrollableView = scrollableView;
    
    this.addEventListener(scrollableView, 'scroll', function(e) {
      _this.currentPage = e.currentPage;
      if (_this.parentImageGallery) {
        _this.parentImageGallery.scrollableView.scrollToView(_this.currentPage);
      }
    });
    
    if (params.clickToFullScreen) {
      this.addEventListener(this.view, 'click', function() {
        var w = new Alloy.UI.FullscreenView();
        w.render('');
        
        var v = new Alloy.UI.ImageGalleryView();
        v.render({images: images, selected: _this.currentPage, parentImageGallery: _this});
        v.view.backgroundColor = '#000';
        w.view.add(v.view);
        
        w.open();
      })
    }
 
    
    if (selected) {
      info("SELECTING " + selected);
      setTimeout(function() {
        scrollableView.scrollToView(selected);  
      }, 1);
    }
        
    this.view.add(scrollableView);
  }
})
