/* global getSlug:true */
(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Dashboard', $dashboardFactory);

  /** @ngInject */
  function $dashboardFactory($http, $q, $interpolate, $ocLazyLoad, $Plugin, System, storage) {
    var getConfigUrl = $interpolate('https://raw.githubusercontent.com/{{repository}}/{{version}}/package.json');
    var getFileUrl = $interpolate('github:{{repository}}@{{version}}/{{file}}');

    function $Dashboard(id, plugins) {
      if (!(this instanceof $Dashboard)) {
        return new $Dashboard(id, plugins);
      }

      this.id = id;
      this.plugins = plugins || [];
    }

    $Dashboard.prototype.getPluginById = function(pluginId) {
      return _.findWhere(this.plugins, { id: pluginId });
    };

    $Dashboard.prototype.getPluginByTitle = function(title) {
      return _.findWhere(this.plugins, { title: title });
    };

    $Dashboard.prototype.loadPlugin = function(pluginId) {
      var plugin = this.getPluginById(pluginId);
      var pluginUrl;

      if (!plugin) {
        return $q.reject('Unknown plugin "' + pluginId + '"');
      }

      pluginUrl = getConfigUrl(plugin);

      return $http
        .get(pluginUrl)
        .then(function(response) {
          var files = response.data.files.map(function(file) {
            var module = angular.extend({ file: file }, plugin);
            var moduleUrl;

            // jspm http api doesn't understand 'v'
            module.version = module.version.replace(/^v/, '');
            moduleUrl = getFileUrl(module);

            return System.import(moduleUrl);
          });

          return $q.all(files);
        })
        .then(function(modules) {
          modules = modules.filter(function(module) {
            return module && module.name;
          }).map(function(module) {
            return $ocLazyLoad.inject(module);
          });

          return $q.all(modules);
        });
    };

    $Dashboard.prototype.getPlugin = function(pluginId) {
      var plugin = this.getPluginById(pluginId);

      if (!plugin) {
        return $q.reject('Unknown plugin "' + pluginId + '"');
      }

      return $q.resolve(new $Plugin(plugin));
    };

    $Dashboard.prototype.save = function() {
      return storage.setItem(this.id, this.plugins);
    };

    $Dashboard.prototype.addPlugin = function(plugin) {
      plugin.id = getSlug(plugin.title);
      this.plugins.push(plugin);

      return this.save();
    };

    $Dashboard.prototype.updatePlugin = function(title, updatedPlugin) {
      var plugin = this.getPluginByTitle(title);

      if (plugin) {
        this.removePlugin(plugin);
      }

      return this.addPlugin(updatedPlugin);
    };

    $Dashboard.prototype.removePlugin = function(plugin) {
      this.plugins.splice(this.plugins.indexOf(plugin), 1);

      return this.save();
    };

    return $Dashboard;
  }
}());
