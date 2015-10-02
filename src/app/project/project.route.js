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
        templateUrl: 'app/project/project.html',
        resolve: { $project: loadProject }
      })
      .state('project.plugin', {
        url: '/plugins/:pluginId',
        resolve: { plugin: loadPlugin }
      });
  }

  /** @ngInject */
  function loadProject($stateParams, projectservice) {
    return projectservice.load($stateParams.projectId);
  }

  /** @ngInject */
  function loadPlugin($stateParams, $project, $state) {
    var pluginId = $stateParams.pluginId;

    return $project
      .loadPlugin(pluginId)
      .then(function() {
        $state.go(pluginId);
      });
  }

})();
