var used = [Ti.UI.createScrollableView];

Alloy.UI.ImageGalleryView = new JS.Class(Alloy.View, {
  initialize: function() {
    this.callSuper(true /* always a partial view */);
    this.currentPage = 0;
    this.view.backgroundColor = '#000';
  },

  render: function(params) {
    if (this.rendered)
      return;
    this.callSuper();

    var bottomHeight = 0;

    if (params.clickToFullScreen) {
      var bgImage = new Label({backgroundImage: '/lib/alloy/UI/images/gallery/picture_background_gradient.png'});
      this.view.add(bgImage);    }
    else {
      bottomHeight = 0;
    }
    
    var _this = this;
    var images = params.images;
    var selected = params.selected;
    this.parentImageGallery = params.parentImageGallery;
    
    var views = [];
    var imageViews = [];
    var reflectionImageViews = [];
      
    for (var i in images) {
      var image = images[i];
      var container = new ScrollView({maxZoomScale: (params.clickToFullScreen ? 1 : 3), top: (params.clickToFullScreen ? 20 : 0), bottom: 10});
      var imageView = new ImageView({image: image, 
        opacity: 1.0, 
        defaultImage: '/public/images/profile/gallery_placeholder.png', 
        preventDefaultImage: false});
      container.add(imageView);
      imageViews.push(imageView);
      
      if (params.clickToFullScreen) {
        imageView.top = 0;
        imageView.bottom = bottomHeight;
        var reflection = new ImageView({image: image, top: 0, bottom: bottomHeight, opacity: 0.2, defaultImage: '/public/images/home/nophoto_thumb.png', preventDefaultImage: false});
        reflection.transform = Ti.UI.create2DMatrix().scale(1, -1).translate(0, - this.view.height + bottomHeight + 40);

        container.add(reflection);
        reflectionImageViews.push(reflection);
      }

      views.push(container);
    }
    
    var scrollableView = new ScrollableView({
      views: views,
      showPagingControl:(images.length > 1),
      top: 0,
      left: 0,
      bottom: 10,
      right: 0,
      pagingControlColor: '#000',
      cacheSize: 11
    });
    this.scrollableView = scrollableView;
    
    this.addEventListener(scrollableView, 'scroll', function(e) {
      _this.currentPage = e.currentPage;
      if (_this.parentImageGallery) {
        _this.parentImageGallery.scrollableView.scrollToView(_this.currentPage);
      }
    }); 
    
    if (selected) {
      info("SELECTING " + selected);
      setTimeout(function() {
        scrollableView.scrollToView(selected);  
      }, 1);
    }
        
    this.view.add(scrollableView);


    if (params.clickToFullScreen) {
      this.addEventListener(this.view, 'doubletap', function() {
        var w = new Alloy.UI.FullscreenView();
        w.render('');
        
        w.addEventListener(w.window, 'open', function(){
          if(w.contentRendered)
            return;
          w.contentRendered = true;  
          var v = new Alloy.UI.ImageGalleryView();
          v.render({images: images, selected: _this.currentPage, parentImageGallery: _this});
          w.view.add(v.view);
        });
        
        w.open();
      });
      
      //blackLine = new View({bottom: bottomHeight + 20, height: 1, backgroundColor: '#000'});
      //this.view.add(blackLine);
      reflectionFade = new Label({touchEnabled: false, bottom: 13, height: 37, backgroundImage: '/lib/alloy/UI/images/gallery/fade_to_black.png'});
      this.view.add(reflectionFade);
    }
  }
})
