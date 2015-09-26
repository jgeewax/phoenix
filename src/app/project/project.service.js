(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$gcProject', $gcProject);

  /** @ngInject */
  function $gcProject($q, $ocLazyLoad, System) {
    // mock data..
    var plugins = {
      'storage-browser': {
        files: 'app/components/storage-browser/storage-browser.controller.js'
      }
    };

    function Project(id) {
      if (!(this instanceof Project)) {
        return new Project(id);
      }

      this.id = id;
    }

    Project.prototype.getPlugins = function() {
      // this would come from another (prolly async) call.. we would store a
      // list of installed plugins somewhere (localStorage, etc.) then request
      // them within this call
      var pluginList = Object.keys(plugins).map(function(plugin) {
        return { name: plugin };
      });

      return $q.resolve(pluginList);
    };

    Project.prototype.loadPlugin = function(name) {
      // this would comes from another (prolly async) call.. we would parse a
      // plugins package.json and retrieve a list of files to load (or maybe
      // just the main file and let the module lazy load the rest..)
      var files = (plugins[name] || {}).files;

      var imports = arrayify(files).map(function(file) {
        return System.import(file);
      });

      return $q.all(imports).then(function(modules) {
        return $ocLazyLoad.inject(modules);
      });
    };

    return Project;
  }

  function arrayify(thing) {
    return angular.isArray(thing) ? thing : [thing];
  }
}());
