var used = [Ti.UI.createTableViewRow, Ti.UI.createTableView, Ti.UI.createView];

Alloy.UI.GridViewRow = new JS.Class({
  initialize: function(params) {
    this.view = new TableViewRow('gridViewRow');
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
    
    var _this = this;
    this.view.addEventListener('touchstart', function(e) {
      Alloy.UI.setColorRecursive(_this.view, '#fff');
    });
  
    this.view.addEventListener('touchcancel', function(e) {
      Alloy.UI.resetColorRecursive(_this.view);
    });
    
    this.view.addEventListener('touchend', function(e) {
      setTimeout(function() {
        Alloy.UI.resetColorRecursive(_this.view);
      }, 2000);
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
    this.tableData = [];
    var currentGridViewRow = null;

    var totalWidth = this._getTotalWidth();
    var itemsPerRow = Math.floor((totalWidth - this.minMargin) / (this.itemWidth + this.minMargin));
    var margin = (totalWidth - (this.itemWidth * itemsPerRow)) / (itemsPerRow + 1);
    
    var itemsInCurrentRow = 0;
    var currentHeader = "~~NOHEADER~~";
    
    for (var i = 0; i < this.gridViewItems.length; i++) {
      var item = this.gridViewItems[i];
      
      var newHeader = false;
      newHeader = (currentHeader != item.header);
      if (newHeader)
        currentHeader = item.header;
      
      if (newHeader || itemsInCurrentRow == 0) {
        itemsInCurrentRow = 0;
        currentGridViewRow = new Alloy.UI.GridViewRow();

        if (newHeader) {
          this.startNewSection(item.header);
        }
        
        this.tableData[this.tableData.length-1].add(currentGridViewRow.view);
        currentGridViewRow.rowIndex = this.tableData[this.tableData.length-1].length - 1;
      }
            
      item.view.left = margin + ((this.itemWidth + margin) * itemsInCurrentRow);
      currentGridViewRow.add(item);
      itemsInCurrentRow = (itemsInCurrentRow + 1) % itemsPerRow;
    }
    
    this.view.setData(this.tableData);    
    this._refreshing = false;
  },
   
  startNewSection: function(header) {
    var section = Ti.UI.createTableViewSection();
    if (header) {
      if (typeof(header) == "string") {
        var v = new View('gridViewSectionHeader');
        var l = new Label('gridViewSectionHeaderLabel');
        l.text = header;
        v.add(l);
        section.headerView = v;
      }
      else
        section.headerView = header;
    }
    
    this.tableData[this.tableData.length] = section;
  }

});
