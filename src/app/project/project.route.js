(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('project', {
        parent: 'projects',
        controller: 'ProjectCtrl',
        controllerAs: 'project',
        url: '/:projectId',
        template: '<div flex layout="row" layout-margin ui-view />',
        resolve: { $project: getProject }
      });
  }

  /** @ngInject */
  function getProject($projects, $stateParams) {
    return $projects.getProject($stateParams.projectId);
  }
})();
