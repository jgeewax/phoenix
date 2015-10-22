(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(dashboardRoutes);

  /** @ngInject */
  function dashboardRoutes($stateProvider) {
    $stateProvider
      .state('dashboard', {
        parent: 'project',
        controller: 'DashboardCtrl',
        controllerAs: 'dashboard',
        url: '/:dashboardId',
        templateUrl: 'app/dashboard/dashboard.html',
        resolve: { $dashboard: getDashboard }
      });
  }

  /** @ngInject */
  function getDashboard($project, $stateParams) {
    var dashboardId = $stateParams.dashboardId;

    if (dashboardId === 'default') {
      dashboardId = $project.id + '-dashboard';
    }

    return $project.getDashboard(dashboardId);
  }
}());
