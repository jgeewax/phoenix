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
    var dashboard = $stateParams.dashboardId;

    if (dashboard === 'default') {
      dashboard = $project.id + '-dashboard';
    }

    return $project.getDashboard(dashboard);
  }
}());
