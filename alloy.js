// We do this at the top of all of our files to include redux:
Ti.include('extern/redux.js');

/**
    @namespace Alloy is an MVVM framework for Appcelerator Titanium mobile. 
		
		To get started --
		<pre>
1. Create a new Titanium mobile project.
2. From project root, from command line execute the following commands -
    git init .
    mkdir Resources/lib
    git submodule add git@github.com:aflatune/Alloy.git Resources/lib/alloy

    cd Resources
    mkdir db
    mkdir db/migrations
    touch db/migrations/empty.migration

    mkdir app
    mkdir app/models
    mkdir app/rjss
    touch app/rjss/common.rjss
    mkdir app/view_models
    mkdir app/views
3. Replace contents of Resources/app.js with sample code in {@link Alloy.ViewModel}
4. Run in iPhone simulator
		</pre>
		
    @see Alloy.View 
*/
var Alloy = {};
if (typeof(AlloyConfig) == 'undefined') AlloyConfig = {};

// Include external libraries
include('extern/js_class_core.js');
include('extern/md5.js');
include('extern/date.js');
include('extern/relative-date.js');

// Include utilities
include('util/util.js');

// Analytics
include('analytics/analytics.js');
//include('analytics/google.js');
//include('analytics/flurry.js');

/*if (AlloyConfig && AlloyConfig.analytics) {
  if (AlloyConfig.analytics.provider == 'google')
    Alloy.analytics = Alloy.analyticsGoogle;
  else if (AlloyConfig.analytics.provider == 'flurry')
    Alloy.analytics = Alloy.analyticsFlurry;
}*/

if (!Alloy.analytics)
  Alloy.analytics = new JS.Singleton(Alloy.AnalyticsBase, {});


// MVVM pattern
//include('model.js');
include('database.js');
include('view.js');
include('view_model.js');
include('vector_view_model.js');

// Alloy UI
include('ui/ui.js');
