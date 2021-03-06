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
  
  doFetch: function(async) {
    this.viewModel.fetch({type: 'reload', async: async});
  },
  
  skipRender: function() {
    if (this.loginMessage) {
      this.view.remove(this.loginMessage);
      this.loginMessage = null;
    }
    // If already rendered once, 
    if (this.rendered) {
      if(this.forCurrentUser) {
        if (this.user && App.currentUser && this.user.username == App.currentUser.username) {
          if (this.viewModel) {
            this.doFetch(true);
            return true;
          }
        }
      }
      else {
        if (this.viewModel)
          this.doFetch(false);
        return true;
      }

      // Start again with an empty view
      this.reset();
    } 
    
    this.viewModel = null;
    if (this.forCurrentUser) {
      if (App.currentUser) {
        this.user = App.currentUser;
        this.window.rightNavButton = null;
      }
      else {
        info ("NO USER!! SHOULD SEE BLANK WINDOW.");
        var message = new Label('profileWindowProfilePrivate');
        message.text = this.placeholderText || "Please sign in";
        this.addEventListener(message, 'click',function(e) {
          Ti.App.fireEvent('app:login:show');
        });
        this.view.add(message);
        this.loginMessage = message;
        
        var login = new Alloy.ImageButton({title: 'Sign in'});
        this.addEventListener(login, 'press',function(e) {
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
