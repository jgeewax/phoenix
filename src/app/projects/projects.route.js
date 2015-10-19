(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(projectsRoutes);

  /** @ngInject */
  function projectsRoutes($stateProvider) {
    $stateProvider
      .state('projects', {
        url: '/projects',
        templateUrl: 'app/projects/projects.html',
        controller: 'ProjectsCtrl',
        controllerAs: 'projects',
        resolve: { $projects: getProjects }
      });
  }

  /** @ngInject */
  function getProjects($Projects, resource) {
    return resource
      .getProjectList()
      .then(function(projects) {
        /* jshint newcap:false */
        return new $Projects(projects);
      });
  }

})();
