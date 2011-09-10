// Tell the compiler which modules we are going to use; note there are no () on
// these!
var used = [Ti.UI.createButton, Ti.UI.createView, Ti.UI.createLabel, Ti.UI.createTextField, Ti.UI.createTableView, Ti.UI.createTableViewRow];

Alloy.UI.LoginView = new JS.Class(Alloy.View, {
  initialize : function() {
    this.tableData = [];
    this.callSuper();
    // Partial view
  },
  
  render : function() {

    // Top section
    var emailTextField = this.createTextField(40, null, "Email address", Ti.App.Properties.getString('email'));
    var passwordTextField = this.createTextField(40, null, "Password", Ti.App.Properties.getString('password'));
    passwordTextField.passwordMask = true;

    // Bottom section
    this.startNewSection();
    var signupRow = this.createRow();
    signupRow.height = 60;
    signupRow.add(new Label({
      text: "Not a member? Join for free.", 
      width: '100%', 
      font: {fontSize: 14, fontWeight: 'bold'},
      textAlign: 'center',
      top: 0
    }));
    this.currentSection().add(signupRow);
    
    // Tableview
    var tableView = new TableView({
      top : 0,
      bottom : 0,
      minRowHeight : 30,
      width : '100%',
      //separatorStyle: 0,
      style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
      data: this.tableData
    });

    this.window.add(tableView);
    
    // Buttons
    var _this = this;
    var cancelButton = new Button({
      title : 'Cancel'
    });
    cancelButton.addEventListener('click', function(e) {
      Ti.App.fireEvent('app:login:dismiss');
    })
    this.window.leftNavButton = cancelButton;

    var loginButton = new Button({
      title : 'Login'
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

    this.window.modal = true;
    this.window.title = "Cupidtino";

    /*if(emailTextField.text && emailTextField.text.length > 0)
      Alloy.UI.focus(emailTextField);
    else
      Alloy.UI.focus(passwordTextField);*/
  },
  
  createRow : function(height) {
    return new TableViewRow({
      height : height
    });
  },
  
  createTextField : function(height, labelText, hintText, text) {
    var row = this.createRow(height);

    var left, width;

    if(labelText) {
      var label = new Label({
        top : 0,
        left : '4%',
        width : '36%',
        height : height,
        text : labelText
      });
      row.add(label); left = '40%', width = '56%';
    }
    else { left = '4%', width = '96%';
    }

    var textField = new TextField({
      top : 4,
      left : left,
      width : width,
      height : height - 8,
      borderStyle : Titanium.UI.INPUT_BORDERSTYLE_NONE,
      hintText : hintText,
      clearButtonMode : Ti.UI.INPUT_BUTTONMODE_ONFOCUS,
      value : text
    });

    row.add(textField);

    this.currentSection().add(row);

    return textField;
  },
  
  currentSection: function() {
    if (this.tableData.length == 0)
      this.startNewSection();
      
    return this.tableData[this.tableData.length-1];
  },
  
  startNewSection: function() {
    this.tableData[this.tableData.length] = Ti.UI.createTableViewSection();
  }
});

Alloy.UI.LoginView.instance = null;

Ti.App.addEventListener('app:login:show', function(e) {
  if (!Alloy.UI.LoginView.instance) {
    Alloy.UI.LoginView.instance = (new Alloy.UI.LoginView());    
    Alloy.UI.LoginView.instance.render();
  }
  var view = Alloy.UI.LoginView.instance;
  view.window.open();
});

Ti.App.addEventListener('app:login:failed', function(e) {
  alert("Sorry, try again");
});

Ti.App.addEventListener('app:login:dismiss', function(e) {
  if (Alloy.UI.LoginView.instance) {
    Alloy.UI.LoginView.instance.window.close();
    Alloy.UI.LoginView.instance = null;
  }
});

Ti.App.addEventListener('app:login:succeeded', function(e) {
  if (Alloy.UI.LoginView.instance)
    Alloy.UI.LoginView.instance.window.close();
});
