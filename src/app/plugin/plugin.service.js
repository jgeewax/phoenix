/* global System:false */
(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Plugin', $pluginFactory);

  /** @ngInject */
  function $pluginFactory($http, $interpolate, $ocLazyLoad, $q, firebaseDriver) {
    var getConfigUrl = $interpolate('https://raw.githubusercontent.com/{{repository}}/{{version}}/package.json');
    var getFileUrl = $interpolate('github:{{repository}}@{{version}}/{{file}}');

    function $Plugin(projectId, dashboardId, id) {
      if (!(this instanceof $Plugin)) {
        return new $Plugin(projectId, dashboardId, id);
      }

      this.projectId = projectId;
      this.dashboardId = dashboardId;
      this.id = id;

      this.$dataRef = firebaseDriver.getPlugin({
        projectId: projectId,
        dashboardId: dashboardId,
        pluginId: id
      });
    }

    $Plugin.prototype.read = function() {
      return this.$dataRef.$loaded();
    };

    $Plugin.prototype.delete = function() {
      return this.$dataRef.$remove();
    };

    $Plugin.prototype.save = function(data) {
      angular.extend(this.$dataRef, data);
      return this.$dataRef.$save();
    };

    $Plugin.prototype.load = function() {
      var pluginData;

      return this.read()
        .then(function(data) {
          pluginData = data;

          if (pluginData.$value === null) {
            // http://stackoverflow.com/questions/25778059/how-to-check-if-the-object-exists-in-firebase-using-angularfire-asobject
            return $q.reject(new Error('Plugin does not exist'));
          } else {
            return data;
          }
        })
        .then(getConfigUrl)
        .then($http.get)
        .then(function(response) {
          var files = response.data.files.map(function(file) {
            var module = angular.extend({ file: file }, pluginData);
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

    return $Plugin;
  }
}());
