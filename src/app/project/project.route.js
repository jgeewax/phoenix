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
        resolve: { plugins: getPlugins }
      })
      .state('project.plugin', {
        url: '/:pluginId',
        resolve: { plugin: loadPlugin }
      });
  }

  /** @ngInject */
  function getPlugins($stateParams, $gcProject) {
    var projectId = $stateParams.projectId;

    return $gcProject(projectId).getPlugins();
  }

  /** @ngInject */
  function loadPlugin($stateParams, $gcProject, $state) {
    var projectId = $stateParams.projectId;
    var pluginId = $stateParams.pluginId;

    return $gcProject(projectId)
      .loadPlugin(pluginId)
      .then(function() {
        $state.go(pluginId);
      });
  }

})();
