Alloy.UI = {};
Ti.include('effects.js');
Ti.include('acts_like_button.js');
Ti.include('form_builder.js');
Ti.include('table_view_pull_to_refresh.js');
Ti.include('table_view_dynamic_scroll.js');
Ti.include('table_view_delete_row.js');
Ti.include('cached_image_view.js');
Ti.include('image_button_bar.js');
Ti.include('loading_view.js');
Ti.include('notification_view.js');
Ti.include('login_view.js');
Ti.include('picker_view.js');
Ti.include('grid_view.js');
Ti.include('effects.js');
Ti.include('web_view.js');
Ti.include('message_view.js');
Ti.include('text_area_view.js');
Ti.include('view_requires_authentication.js');
Ti.include('fullscreen_view.js');
Ti.include('image_gallery_view.js');
Ti.include('image_button.js');
Ti.include('table_view_navigation_with_row_selection.js');

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

Alloy.UI.addContentShadows = function(tableView, container, showTopShadow, showBottomShadow) {
  if (typeof(showTopShadow) == 'undefined') showTopShadow = true;
  if (typeof(showBottomShadow) == 'undefined') showBottomShadow = true;
  
  if (showTopShadow) {
    var tableHeader = Ti.UI.createView({
      backgroundImage:"/lib/alloy/ui/images/view_shadow_top.png",
      //backgroundColor: "#f00",
      width:320,height:20});

    tableView.headerView = tableHeader;
    tableView.top = -20;

    /*var containerHeader = Ti.UI.createView({
      //backgroundImage:"/lib/alloy/ui/images/view_shadow_bottom.png",
      backgroundColor: "#0f0",
      width:320,height:20,top:0});
    container.add(containerHeader);*/
  }

  if (showBottomShadow) {
    var tableFooter = Ti.UI.createView({ 
      backgroundImage:"/lib/alloy/ui/images/view_shadow_bottom.png",
      //backgroundColor: "#f00",
      width:320,height:20});

    tableView.footerView = tableFooter;
    tableView.bottom = -20;

    /*var containerFooter = Ti.UI.createView({
      //backgroundImage:"/lib/alloy/ui/images/view_shadow_top.png",
      backgroundColor: "#0f0",
      width:320,height:20, bottom: 0, zIndex: -100});

    container.add(containerFooter);*/
  }
}

Alloy.UI.enableRowSelectionEvents = function(tableView) {
  if (!tableView.enabledRowSelectionEvents) {
    tableView.enabledRowSelectionEvents = true;
    
    tableView.addEventListener('click', function(e) {
      if (tableView.selectedRowIndex != null) {
        tableView.fireEvent('rowDeselected', {index: tableView.selectedRowIndex, row: tableView.selectedRow});
        tableView.selectedRowIndex = null;
      }
      if (e.row.selectionStyle != Titanium.UI.iPhone.TableViewCellSelectionStyle.NONE) {
        tableView.selectedRowIndex = e.index;
        tableView.selectedRow = e.row;
        tableView.fireEvent('rowSelected', e);
      }
    });
  }
  
  tableView.deselect = function() {
    this.deselectRow(this.selectedRowIndex);
    this.fireEvent('rowDeselected', {index: this.selectedRowIndex, row: this.selectedRow});
    this.selectedRowIndex = null;
  }
}

