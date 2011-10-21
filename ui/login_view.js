// Tell the compiler which modules we are going to use; note there are no () on
// these!
var used = [Ti.UI.createButton, Ti.UI.createView, Ti.UI.createLabel, Ti.UI.createTextField, Ti.UI.createTableView, Ti.UI.createTableViewRow];

Alloy.UI.LoginView = new JS.Singleton(Alloy.View, {
  config: {
    color: '#fff',
    signupText: 'Not a member? Join for free.',
    barColor: '#000',
    emailTextField: {
      hint: 'Email address',
      validate: function(email) {
        if (!email.isValidEmail()) {
          Alloy.UI.alert("Please enter a valid email address.", "Wait!");
          return false;
        }
        return true;
      }
    }
  },
  
  initialize : function() {
    this.callSuper();
    this.window.translucent = true;
    this.window.barColor = this.config.barColor;
    this.formBuilder = new Alloy.UI.FormBuilder(this.window);
    this.name = 'login';
  },
  
  render : function() {
    var _this = this;
    this.callSuper();
    
    // Top section
    this.formBuilder.startNewSection();

    var emailTextField = this.formBuilder.createTextField(40, null, this.config.emailTextField.hint, Ti.App.Properties.getString('email'), Titanium.UI.KEYBOARD_EMAIL, Titanium.UI.RETURNKEY_NEXT, this.config.backgroundColor);
    emailTextField.suppressReturn = true;
    emailTextField.color = this.config.color;
    this.emailTextField = emailTextField;
    
    var passwordTextField = this.formBuilder.createTextField(40, null, "Password", Ti.App.Properties.getString('password'), Titanium.UI.KEYBOARD_ASCII, Titanium.UI.RETURNKEY_GO, this.config.backgroundColor);
    passwordTextField.passwordMask = true;
    passwordTextField.suppressReturn = true;
    passwordTextField.color = this.config.color;
    this.passwordTextField = passwordTextField;

    // Bottom section
    if (this.config.signupText) {
      this.formBuilder.startNewSection();
      var joinButton = this.formBuilder.createButton(60, this.config.signupText, this.config.color, this.config.backgroundColor);
      joinButton.color = this.config.color;
      if (_this.config.signupUrl) {
        joinButton.addEventListener('click', function() {
          Alloy.UI.WebView.show(_this.config.signupUrl);
        })
      }
      
      this.signupButton = joinButton;
    }
    
    // Render the form
    var formTable = this.formBuilder.render();
    formTable.top = 40;

    // Nav bar buttons
    var cancelButton = new Button('toolbarButton');
    cancelButton.title = 'Cancel';
    
    this.window.leftNavButton = cancelButton;

    var loginButton = new Button({
      title : 'Login',
      backgroundColor:'blue',
      className: 'toolbarButton'
    });
    this.rightNavButton = loginButton;
    
    this.window.rightNavButton = loginButton;
    
    // Toolbar
    /*var flexSpace = Titanium.UI.createButton({
      systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    });
    var toolbar = new Toolbar({
      items:[cancelButton, flexSpace, loginButton],
      top:0,
      translucent:true,
      barColor: '#fff',
      backgroundImage: '/public/images/diagonal-noise.png'
    });

    this.window.add(toolbar);
    */
   
    // Attach toolbar button events after window loads
    // http://developer.appcelerator.com/question/125494/inexplicable-bug-toolbar-button-only-listens-4-clicks
    //this.window.addEventListener("open", function(e) {
      // Prevent multiple invocation when the same window is closed and opend multiple times
      //if (_this.toolbarButtonEventsAttached)
      //  return;
      
      //this.toolbarButtonEventsAttached = true;  
      loginButton.addEventListener('click', function(e) {
        // Login button
        var email = emailTextField.value.trim();
        var password = passwordTextField.value.trim();
        
        if (!_this.config.emailTextField.validate(email)) {
          emailTextField.focus();
          return;
        }
  
        if (password.length < 5) {
          Alloy.UI.alert("Your password should be a bit longer.", "Wait!");
          passwordTextField.focus();
          return;
        }
  
        Ti.App.fireEvent('app:login', {email: email, password: password});
      })

      cancelButton.addEventListener('click', function(e) {
        Ti.App.fireEvent('app:login:dismiss');
      })

    //});

    emailTextField.addEventListener('return', function() {
      passwordTextField.focus();
    });

    passwordTextField.addEventListener('return', function() {
      loginButton.fireEvent('click');
    });
    
    Ti.App.fireEvent('app:login:view_rendered');

    // Show error on login failure    
    Ti.App.addEventListener('app:login:failed', function(e) {
      alert("Sorry, try again");
    });
  },

  reset: function() {
    this.emailTextField.value = '';
    this.passwordTextField.value = '';
  }
});

Ti.App.addEventListener('app:login:show', function(e) {
  var view = Alloy.UI.LoginView;
  if (!view.rendered)
    view.render();
  
  view.open({modal: false, nav: 'global'});
  //view.window.open({modal:false, animated:true, title: "Cupidtino", navBarHidden: true, transition:Ti.UI.iPhone.AnimationStyle.FLIP_FROM_RIGHT});
});

Ti.App.addEventListener('app:login:dismiss', function(e) {
  Alloy.UI.LoginView.window.close({animated:true});
});

Ti.App.addEventListener('app:login:succeeded', function(e) {
    Alloy.UI.LoginView.window.close({animated:true});
});
