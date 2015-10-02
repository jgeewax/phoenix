(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('projectservice', projectservice);

  /** @ngInject */
  function projectservice($q, $interpolate, $http, System, $ocLazyLoad, projectCache, projectStorage) {
    var getConfigUrl = $interpolate('https://raw.githubusercontent.com/{{repository}}/{{version}}/package.json');
    var getFileUrl = $interpolate('github:{{repository}}@{{version}}/{{file}}');

    function Project(id) {
      this.id = id;
      this.plugins = [];
    }

    Project.prototype.load = function() {
      var self = this;

      this.storage = projectStorage({
        projectId: this.id,
        driver: 'localStorage'
      });

      return this.storage.getItem('plugins')
        .then(function(plugins) {
          self.plugins = plugins;
        });
    };

    Project.prototype.addPlugin = function(plugin) {
      this.plugins.push(plugin);
      return this.storage.setItem('plugins', this.plugins);
    };

    Project.prototype.removePlugin = function(plugin) {
      var index = this.plugins.indexOf(plugin);

      this.plugins.splice(index, 1);
      return this.storage.setItem('plugins', this.plugins);
    };

    Project.prototype.getPlugin = function(pluginId) {
      var length = this.plugins.length;
      var i = 0;
      var plugin;

      for (; i < length; i++) {
        plugin = this.plugins[i];

        if (plugin.id === pluginId) {
          return plugin;
        }
      }

      return null;
    };

    Project.prototype.loadPlugin = function(pluginId) {
      var plugin = this.getPlugin(pluginId);
      var pluginUrl;

      if (!plugin) {
        return $q.reject('Unknown plugin "' + pluginId + '"');
      }

      pluginUrl = getConfigUrl(plugin);

      return $http.get(pluginUrl, { cache: projectCache })
        .then(function(response) {
          var files = response.data.files.map(function(file) {
            var moduleUrl = getFileUrl(angular.extend({ file: file }, plugin));

            return System.import(moduleUrl);
          });

          return $q.all(files);
        })
        .then(function(modules) {
          return $ocLazyLoad.inject(modules);
        });
    };

    function load(projectId) {
      var project = new Project(projectId);

      return project.load().then(function() {
        return project;
      });
    }

    return {
      load: load
    };
  }
}());
