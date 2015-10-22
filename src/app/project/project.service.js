(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Project', $projectFactory);

  /** @ngInject */
  function $projectFactory($Dashboard, firebaseDriver) {
    function $Project(project) {
      if (!(this instanceof $Project)) {
        return new $Project(project);
      }

      angular.extend(this, project);

      this.id = project.projectId;
      this.dashboards = {
        $data: firebaseDriver.getMyDashboards(this.id)
      };
    }

    $Project.prototype.getDashboard = function(id) {
      return new $Dashboard(this.id, id);
    };

    return $Project;
  }
}());
