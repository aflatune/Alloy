Alloy.Database = new JS.Class({
  extend: {
    getInstance: function() {
      if (typeof(Alloy.Database.instance) == 'undefined')
        Alloy.Database.instance = new Alloy.Database();
        
      return Alloy.Database.instance;
    }
  },
  
  db_name: "ti_store",

  initialize: function() {
    Titanium.API.info("Initializing DB");
    this.db = Titanium.Database.open(this.db_name);

    Titanium.API.log("debug", "initialize_db");
    this.db.execute('CREATE TABLE IF NOT EXISTS schema_migrations (version text NOT NULL PRIMARY KEY)');
    this.db.execute('CREATE TABLE IF NOT EXISTS view_model_cache (url text NOT NULL PRIMARY KEY, data text)');

    this.seed_db();
  },

  seed_db: function() {
    Titanium.API.log("debug", "seed_db");
    // use this hook to initialize the database
  },
  
  loadMigrations: function()
  {
    var results = {};

    //Get TODOs from database
    var resultSet = this.db.execute("SELECT * FROM schema_migrations");
    while (resultSet.isValidRow()) {
      var row;
      for (var i = 0; i < resultSet.fieldCount(); i++) {
        row = resultSet.field(i);
      }
      results[row] = row;
      resultSet.next();
    }
    resultSet.close();

    return results;
  },
  
  migrate_db: function() {
    var migrations = this.loadMigrations();

    var migration_dir = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "db", "migrations");

    var files = migration_dir.getDirectoryListing();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
			var parts = file.split(".");
			if(parts[1] == 'migration') {
        var version = parts[0];

				if (!migrations[version])
				{
			    Ti.API.info("Running migration... " + version);
			    Ti.include("/db/migrations/"  + file);
				}							
			}
    }
  },
  
  migrate: function(version, sql) {
    this.db.execute(sql);
    this.db.execute("INSERT INTO schema_migrations VALUES (?)", version);
  }
});
Alloy.Database.getInstance().migrate_db();

function migrate(version, sql) {
  Alloy.Database.getInstance().migrate(version, sql);
}