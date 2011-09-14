// Tell the compiler which modules we are going to use; note there are no () on
// these!
var used = [Ti.UI.createButton, Ti.UI.createView, Ti.UI.createLabel, Ti.UI.createTextField, Ti.UI.createTableView, Ti.UI.createTableViewRow];

Alloy.UI.LoginView = new JS.Class(Alloy.View, {
  initialize : function() {
    this.tableData = [];
    this.callSuper();
    //$(this.window).applyStyle('Window', {className: 'loginViewWindow'});;
    
    // Show error on login failure    
    Ti.App.addEventListener('app:login:failed', function(e) {
      alert("Sorry, try again");
    });
  },
  
  render : function() {
    // Top section
    var emailTextField = this.createTextField(40, null, "Email address", Ti.App.Properties.getString('email'), Titanium.UI.KEYBOARD_EMAIL, Titanium.UI.RETURNKEY_NEXT);
    emailTextField.suppressReturn = true;
    this.emailTextField = emailTextField;
    
    var passwordTextField = this.createTextField(40, null, "Password", Ti.App.Properties.getString('password'), Titanium.UI.KEYBOARD_ASCII, Titanium.UI.RETURNKEY_GO);
    passwordTextField.passwordMask = true;
    passwordTextField.suppressReturn = true;
    this.passwordTextField = passwordTextField;

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

    var table = new TableView({data:this.tableData, style:Titanium.UI.iPhone.TableViewStyle.GROUPED});
    this.window.add(table);
    
    
    // Tableview
    //var tableView = new TableView({
    //});

    //this.window.add(tableView);

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
    //this.window.add(loginButton);
    
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

    //this.window.modal = true;
    //this.window.title = "Cupidtino";

    /*if(emailTextField.text && emailTextField.text.length > 0)
      Alloy.UI.focus(emailTextField);
    else
      Alloy.UI.focus(passwordTextField);*/

    emailTextField.addEventListener('return', function() {
      passwordTextField.focus();
    });

    passwordTextField.addEventListener('return', function() {
      loginButton.fireEvent('click');
    });
  },
  
  createRow : function(height) {
    return new TableViewRow({
      height : height
    });
  },
  
  createTextField : function(height, labelText, hintText, text, keyboardType, returnKeyType) {
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
        
      row.add(label); 
      left = '40%';
      width = '56%';
    }
    else { 
      left = '4%';
      width = '96%';
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

    if (keyboardType)
      textField.keyboardType = keyboardType;
      
    if (returnKeyType)
      textField.returnKeyType = returnKeyType;

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
  },
  
  reset: function() {
    this.emailTextField.value = '';
    this.passwordTextField.value = '';
  }
});

Alloy.UI.LoginView.instance = null;

Ti.App.addEventListener('app:login:show', function(e) {
  //setTimeout(function() {
  if (!Alloy.UI.LoginView.instance) {
    Alloy.UI.LoginView.instance = (new Alloy.UI.LoginView());    
    Alloy.UI.LoginView.instance.render();
  }
  var view = Alloy.UI.LoginView.instance;
  
  /*var t = Titanium.UI.create2DMatrix();
  t = t.scale(0);

  view.window.transform = t;

  // create first transform to go beyond normal size
  var t1 = Titanium.UI.create2DMatrix();
  t1 = t1.scale(1.1);
  var a = Titanium.UI.createAnimation();
  a.transform = t1;
  a.duration = 200;

  // when this animation completes, scale to normal size
  a.addEventListener('complete', function()
  {
    var t2 = Titanium.UI.create2DMatrix();
    t2 = t2.scale(1.0);
    view.window.animate({transform:t2, duration:200});

  });*/

  // // create a button to close window
  // var b = Titanium.UI.createButton({
    // title:'Close',
    // height:30,
    // width:150
  // });
  // w.add(b);
  // b.addEventListener('click', function()
  // {
    // var t3 = Titanium.UI.create2DMatrix();
    // t3 = t3.scale(0);
    // w.close({transform:t3,duration:300});
  // });

  //w.zIndex = 10000;

  /*setTimeout(function() {
    //App.tabGroup.activeTab.open(view.window);
    view.window.open(a);
  }, 1000);*/
  
  view.window.open({modal:true, animated:true, title: "Cupidtino", navBarHidden: false});
  //}, 5000);
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
