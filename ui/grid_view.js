var used = [Ti.UI.createTableViewRow, Ti.UI.createTableView, Ti.UI.createView];

Alloy.UI.GridViewRow = new JS.Class({
  initialize: function(params) {
    this.view = new TableViewRow({
      backgroundColor: 'transparent',
      height: 'auto',
      minHeight: 30
    });
    
    this.contentView = new View({height: 'auto', width: '100%', top:0});
    this.view.add(this.contentView);
  },
  
  add: function(gridViewItem) {
    this.contentView.add(gridViewItem.view);
    gridViewItem.gridViewRow = this;
  }

});

Alloy.UI.GridViewItem = new JS.Class({
  initialize: function(gridView, params) {
    this.width = gridView.itemWidth;
    this.height = gridView.itemHeight;
    this.header = params.header;
    
    this.view = new View({
      //backgroundColor: '#0f0',
      height: this.height,
      width: this.width
    });
  }
});

Alloy.UI.GridView = new JS.Class({
  initialize: function(params) {
    params = params || {};
    this.itemWidth = params.itemWidth || 50;
    this.itemHeight = params.itemHeight || 50;
    this.minMargin = params.minMargin || 0;
    this.view = new TableView({
      focusable: false,
      separatorStyle: Titanium.UI.iPhone.TableViewSeparatorStyle.NONE,
      allowsSelection: false
    });
  },
  
  render: function(params) {
    
  },
  
  _getTotalWidth: function() {
    if (Ti.UI.currentWindow)
      width = Ti.UI.currentWindow.width;
    else if (App && App.tabGroup)
      width = App.tabGroup.width;
    else
      width = Ti.Platform.displayCaps.platformWidth;
      
    return width;
  },
  
  setData: function(gridViewItems) {
    this.gridViewItems = gridViewItems;
    this.refresh();
  },
  
  refresh: function() {
    if (this._refreshing)
      return;

    this._refreshing = true;
    var tableData = [];
    var currentGridViewRow = null;

    var totalWidth = this._getTotalWidth();
    var itemsPerRow = Math.floor((totalWidth - this.minMargin) / (this.itemWidth + this.minMargin));
    var margin = (totalWidth - (this.itemWidth * itemsPerRow)) / (itemsPerRow + 1);
    
    var itemsInCurrentRow = 0;
    var currentHeader = null;
    
    for (var i = 0; i < this.gridViewItems.length; i++) {
      var item = this.gridViewItems[i];
      
      var newHeader = false;
      if (item.header) {
        newHeader = (currentHeader != item.header);
        if (newHeader)
          currentHeader = item.header;
      }
      
      if (newHeader || itemsInCurrentRow == 0) {
        itemsInCurrentRow = 0;
        currentGridViewRow = new Alloy.UI.GridViewRow();
        if (newHeader && item.header)
          currentGridViewRow.view.header = item.header;
          
        tableData.push(currentGridViewRow.view);
        currentGridViewRow.rowIndex = tableData.length - 1;
      }
            
      item.view.left = margin + ((this.itemWidth + margin) * itemsInCurrentRow);
      currentGridViewRow.add(item);
      itemsInCurrentRow = (itemsInCurrentRow + 1) % itemsPerRow;
    }
    
    this.view.setData(tableData);    
    this._refreshing = false;
  }
});
