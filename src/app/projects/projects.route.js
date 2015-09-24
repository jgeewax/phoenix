(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('projects', {
        url: '/projects',
        templateUrl: 'app/projects/projects.html',
        controller: 'ProjectsCtrl',
        controllerAs: 'projects',
        resolve: { projectList: getProjects }
      });
  }

  /** @ngInject */
  function getProjects(resource) {
    return resource.getProjectList();
  }

})();
