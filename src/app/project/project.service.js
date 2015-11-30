/* global getSlug:true */
(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Project', $projectFactory);

  /** @ngInject */
  function $projectFactory($Dashboard, $q, firebaseDriver) {
    function $Project(project) {
      if (!(this instanceof $Project)) {
        return new $Project(project);
      }

      angular.extend(this, project);

      this.id = project.projectId;
      this.dashboards = {
        $data: firebaseDriver.getDashboards(this.id)
      };
    }

    $Project.prototype.createDashboard = function(name, plugins) {
      var dashboardId = getSlug(name);
      var $dashboard = this.getDashboard(dashboardId);

      return $dashboard.exists()
        .then(function(exists) {
          if (exists) {
            return $q.reject(new Error('Dashboard already exists'));
          }

          var options = { name: name };

          if (plugins) {
            options.plugins = plugins;
          }

          return $dashboard.save(options);
        })
        .then(function() {
          return $dashboard;
        });
    };

    $Project.prototype.getDashboard = function(id) {
      return new $Dashboard(this.id, id);
    };

    return $Project;
  }
}());
