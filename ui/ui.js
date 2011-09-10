Alloy.UI = {};
Ti.include('table_view_pull_to_refresh.js');
Ti.include('table_view_dynamic_scroll.js');
Ti.include('table_view_delete_row.js');
Ti.include('cached_image_view.js');
Ti.include('image_button_bar.js');
Ti.include('loading_view.js');
Ti.include('login_view.js');


Alloy.UI.focus = function(control) {
  control.addEventListener('setFocus', function() {
    control.focus();
  });
     
  control.fireEvent('setFocus');
}

Alloy.UI.alert = function(message, title) {
  var alertDialog = Titanium.UI.createAlertDialog({
      title : title || 'Alert',
      message : message
    });
  alertDialog.show();
}
