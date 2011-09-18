// Tell the compiler which modules we are going to use; note there are no () on
// these!
var used = [Ti.UI.createButton, Ti.UI.createView, Ti.UI.createLabel, Ti.UI.createTextField, Ti.UI.createTableView, Ti.UI.createTableViewRow];

Alloy.UI.LoginView = new JS.Class(Alloy.View, {
  initialize : function() {
    this.callSuper();
    this.formBuilder = new Alloy.UI.FormBuilder(this.window);
    
    // Show error on login failure    
    Ti.App.addEventListener('app:login:failed', function(e) {
      alert("Sorry, try again");
    });
  },
  
  render : function() {
    // Top section
    this.formBuilder.startNewSection();

    var emailTextField = this.formBuilder.createTextField(40, null, "Email address", Ti.App.Properties.getString('email'), Titanium.UI.KEYBOARD_EMAIL, Titanium.UI.RETURNKEY_NEXT);
    emailTextField.suppressReturn = true;
    this.emailTextField = emailTextField;
    
    var passwordTextField = this.formBuilder.createTextField(40, null, "Password", Ti.App.Properties.getString('password'), Titanium.UI.KEYBOARD_ASCII, Titanium.UI.RETURNKEY_GO);
    passwordTextField.passwordMask = true;
    passwordTextField.suppressReturn = true;
    this.passwordTextField = passwordTextField;

    // Bottom section
    this.formBuilder.startNewSection();
    var joinButton = this.formBuilder.createButton(60, "Not a member? Join for free.");

    // Render the form
    var formTable = this.formBuilder.render();
    formTable.top = 40;

    // Nav bar buttons
    var _this = this;
    var cancelButton = new Button({
      title : 'Cancel'
    });
    cancelButton.addEventListener('click', function(e) {
      Ti.App.fireEvent('app:login:dismiss');
    })
    this.window.leftNavButton = cancelButton;

    var loginButton = new Button({
      title : 'Login',
      style: Ti.UI.iPhone.SystemButtonStyle.DONE,
      backgroundColor:'blue'
    });
    this.window.rightNavButton = loginButton;
    
    loginButton.addEventListener('click', function(e) {
      var email = emailTextField.value.trim();
      var password = passwordTextField.value.trim();
      
      if (!email.isValidEmail()) {
        Alloy.UI.alert("Please enter a valid email address.", "Wait!");
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

    emailTextField.addEventListener('return', function() {
      passwordTextField.focus();
    });

    passwordTextField.addEventListener('return', function() {
      loginButton.fireEvent('click');
    });
  },

  reset: function() {
    this.emailTextField.value = '';
    this.passwordTextField.value = '';
  }
});

Alloy.UI.LoginView.instance = null;

Ti.App.addEventListener('app:login:show', function(e) {
  if (!Alloy.UI.LoginView.instance) {
    Alloy.UI.LoginView.instance = (new Alloy.UI.LoginView());    
    Alloy.UI.LoginView.instance.render();
  }
  var view = Alloy.UI.LoginView.instance;
  
  view.window.open({modal:true, animated:true, title: "Cupidtino", navBarHidden: false});
});

Ti.App.addEventListener('app:login:dismiss', function(e) {
  if (Alloy.UI.LoginView.instance) {
    Alloy.UI.LoginView.instance.window.close();
    Alloy.UI.LoginView.instance = null;
  }
});

Ti.App.addEventListener('app:login:succeeded', function(e) {
  if (Alloy.UI.LoginView.instance)
    Alloy.UI.LoginView.instance.window.close({animated:true});
});
