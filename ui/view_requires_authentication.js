Alloy.UI.ViewRequiresAuthentication = new JS.Module({
  addAuthEventHandlers: function() {
    var _this = this;
    this.addEventListener(Ti.App, 'app:login:succeeded', function(){
      _this.render();
    });
      
    this.addEventListener(Ti.App, 'app:logout:succeeded', function(){
      _this.render();
    });

    this.addEventListener(Ti.App, 'app:profile:updated', function(){
      _this.render();
    });
  },
  
  skipRender: function() {
    // If already rendered once, 
    if (this.rendered) {
      if(this.forCurrentUser) {
        if (this.user && App.currentUser && this.user.username == App.currentUser.username) {
          if (this.viewModel) {
            this.viewModel.fetch({type: 'reload', async:true});
            return true;
          }
        }
      }
      else {
        if (this.viewModel)
          this.viewModel.fetch({type: 'reload'});
        return true;
      }

      // Start again with an empty view
      this.reset();
    } 
    
    this.viewModel = null;
    if (this.forCurrentUser) {
      if (App.currentUser) {
        this.user = App.currentUser;
      }
      else {
        info ("NO USER!! SHOULD SEE BLANK WINDOW.");
        var message = new Label('profileWindowProfilePrivate');
        message.text = "Please log in";
        this.view.add(message);
        
        var login = new Button({title: 'Login'});
        this.addEventListener(login, 'click',function(e) {
          Ti.App.fireEvent('app:login:show');
        });
        this.window.rightNavButton = login;

        return true;
      }
    }

    return false;    
  },
  
  reset: function() {
    this.window.remove(this.view);
    this.window.rightNavButton = null;
    this.view = new View();
    this.window.add(this.view);
  }

});
