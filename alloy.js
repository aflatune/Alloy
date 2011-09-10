// We do this at the top of all of our files to include redux:
Ti.include('extern/redux.js');

var Alloy = {};

// Include external libraries
include('extern/js_class_core.js');
include('extern/md5.js');

// Include utilities
include('util/util.js');

// MVVM pattern
include('model.js');
include('database.js');
include('view.js');
include('view_model.js');
include('vector_view_model.js');

// Alloy UI
include('ui/ui.js');
