var plugin = function() {};

//the version of this plugin. Placed in by grunt when built
//you can change this value in the package.json (under version)
plugin.version = '@@VERSION';

//the version of gf that is required for this plugin
//to function correctly. Placed in by grunt when built
//you can change this value in the package.json (under engines.gf)
plugin.gfVersion = '@@GF_VERSION';

//register the plugin to grapefruit
gf.plugin.register(plugin, 'plugin');