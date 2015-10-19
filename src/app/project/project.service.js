(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Project', $projectFactory);

  /** @ngInject */
  function $projectFactory($Dashboard, storage) {
    function $Project(project, dashboards) {
      if (!(this instanceof $Project)) {
        return new $Project(project);
      }

      angular.extend(this, project);
      this.id = this.projectId;
      this.dashboards = dashboards;
    }

    $Project.prototype.getDashboard = function(dashboardId) {
      return storage.getItem(dashboardId)
        .then(null, function() {
          return [];
        })
        .then(function(plugins) {
          return new $Dashboard(dashboardId, plugins);
        });
    };

    return $Project;
  }
}());
