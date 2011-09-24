Alloy.VectorViewModel = new JS.Class(Alloy.ViewModel, {
  initialize: function(view) {
    this.callSuper();
    
    // Vector view model stores an array of objects
    this.data = [];

    // [Optional] page number to load rows progressively
    this.rowsPerPage = 10;
    
    // Name of the unique id attribute, same as database table primary key
    // Typically 'id', but could be 'username', 'item_id', etc depending on your schema
    this.idAttributeName = 'id';
  },
  
  fetch: function(params) {
    if (params.page == null)
      params.page = Math.ceil((this.data.length / this.rowsPerPage) + 1);
      
    params.rowsPerPage = this.rowsPerPage;
    
    if (params.type == 'reload') {
      params.page = 1; // Load first page again
      //this.oldData = this.data;
      //this.data = [];
      params.rowsPerPage = this.data.length || this.rowsPerPage;
      
      // If last time not enough items got returned, now ask for more
      if (params.rowsPerPage < this.rowsPerPage)
        params.rowsPerPage = this.rowsPerPage;
      
      //info("params.rowsPerPage = " + params.rowsPerPage);
    }
   
    this.callSuper(params);
  },
 
  dataReady: function(data, params) {
    
    // The view is interested in all data together
    if (this.view.dataReady) {
      this.view.dataReady(data, params, this);
    }
    
    // Or as diff updates and append calls
    else {
      this.view.beginUpdate();
  
      // If starting from empty data, repaint the table with new data
      //if (this.data.length == 0) {
      //  this.data = data;
      //  this.view.dataReady(this, this.data);   // repaint table
      //}
      // otherwise do diff updates
      //else {
      //}
      
      if (params.type == 'reload') {
        // Diff apply changes
        this.diffUpdate(this.data, data, (params.page - 1) * params.rowsPerPage, params.type == 'reload');
      }
      else {
        // Append
        for (var i = 0; i < data.length; i++) {
          var newDataItem = data[i];
          var row = this.view.createRow(newDataItem, this);
          this.view.appendRow(row, this);
          this.data.push(newDataItem);
        }
      }
      this.view.endUpdate();      
    }
  },
  
  
  lookupID: function(id, data) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][this.idAttributeName] == id)
        return i;
    }
    
    return -1;
  },
  
  diffUpdate: function(oldData, newData, newDataStartIndex, fullReload) {
    //info('Starting diff update');
    
    var oldDataCount = oldData.length;
    var exhaustedOldData = false;
    
    //info('oldData length: ' + oldData.length);
    //info('newData length: ' + newData.length);
    
    for (var i = 0; i < newData.length; i++) {
      var newDataItem = newData[i];
      if (i >= oldDataCount - newDataStartIndex)
        exhaustedOldData = true;
      
      var oldDataIndex = i + newDataStartIndex;
      var oldDataItem = oldData[oldDataIndex];
      var row = this.view.createRow(newDataItem, this);
      
      // If no more items in the old data, just append items from new data
      if (exhaustedOldData) {
        this.view.appendRow(row, this);
        oldData.push(newDataItem);
      }
      else {
        var newID = newDataItem[this.idAttributeName];
        var oldID = oldDataItem[this.idAttributeName];
        // If item id is same, 
        if (newID == oldID) {
          // and contents have changed, update the item
          if (this.sameObjects(newDataItem, oldDataItem)) {
            //info('Skipping row ' + oldDataIndex);
          }
          else {
            this.view.updateRow(oldDataIndex, row, this);
            oldData[oldDataIndex] = newDataItem;
          }  
        }
        else {
          // If the item existed elsewhere in the old data, then remove it
          var movingUp = false;
          var oldItemPosition = this.lookupID(newID, oldData);
          if (oldItemPosition >= 0) {
            movingUp = true;
            this.view.deleteRow(oldItemPosition, this, movingUp);
            oldData.splice(oldItemPosition, 1); // remove from position i
            
          }
          
          // Insert item at new position
          this.view.insertRow(oldDataIndex, row, this, movingUp);
          oldData.splice(oldDataIndex, 0, newDataItem);  // insert at position i
        }
      }
    }
    
    // Remove extra rows left over at the bottom
    if (fullReload) {
      if (newData.length + newDataStartIndex < oldData.length) {
        for (var i = oldData.length - 1; i >= newData.length + newDataStartIndex; i --) {
          this.view.deleteRow(i, this);
          oldData.splice(i, 1);
        }
      }
      
    }

    
  },
  
  setRequestHeaders: function(xhr, params) {
    this.callSuper(xhr, params);
  },

});
