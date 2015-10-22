(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Dashboard', $dashboardFactory);

  /** @ngInject */
  function $dashboardFactory($http, $q, $interpolate, $ocLazyLoad, $Plugin, System, firebaseDriver) {
    function $Dashboard(projectId, id) {
      if (!(this instanceof $Dashboard)) {
        return new $Dashboard(projectId, id);
      }

      this.projectId = projectId;
      this.id = id;

      this.$dataRef = firebaseDriver.getMyDashboard({
        projectId: projectId,
        dashboardId: id
      });
    }

    $Dashboard.prototype.read = function() {
      return this.$dataRef.$loaded();
    };

    $Dashboard.prototype.save = function(data) {
      return this.$dataRef.then(function($ref) {
        return $ref.$save(data);
      });
    };

    $Dashboard.prototype.getPlugin = function(id) {
      return new $Plugin(this.projectId, this.id, id);
    };

    return $Dashboard;
  }
}());
