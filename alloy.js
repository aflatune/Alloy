// We do this at the top of all of our files to include redux:
Ti.include('extern/redux.js');

var Alloy = {};
if (typeof(AlloyConfig) == 'undefined') AlloyConfig = {};

// Include external libraries
include('extern/js_class_core.js');
include('extern/md5.js');

// Include utilities
include('util/util.js');

// Analytics
include('analytics/analytics.js');
if (AlloyConfig && AlloyConfig.analytics) {
  if (AlloyConfig.analytics.provider == 'google')
    include('analytics/google.js');
  else if (AlloyConfig.analytics.provider == 'flurry')
    include('analytics/flurry.js');
}

if (!Alloy.analytics)
  Alloy.analytics = new JS.Singleton(Alloy.AnalyticsBase, {});


// MVVM pattern
include('model.js');
include('database.js');
include('view.js');
include('view_model.js');
include('vector_view_model.js');

// Alloy UI
include('ui/ui.js');
