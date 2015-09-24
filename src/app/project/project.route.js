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
        url: '/:projectId',
        templateUrl: 'app/project/project.html',
        resolve: { project: getProject }
      });
  }

  /** @ngInject */
  function getProject($stateParams, projectList) {
    var projectId = $stateParams.projectId;

    for (var i = 0; i < projectList.length; i++) {
      if (projectList[i].projectId === projectId) {
        return projectList[i];
      }
    }

    throw new Error('Unknown project id "' + projectId + '"');
  }

})();
