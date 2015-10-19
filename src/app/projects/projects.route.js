(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(routeConfig)
    .controller('ImportCtrl', ImportCtrl);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('projects', {
        url: '/projects',
        templateUrl: 'app/projects/projects.html',
        controller: 'ProjectsCtrl',
        controllerAs: 'projects',
        resolve: { projectList: getProjects }
      })
      .state('projects.import', {
        url: '/import/:configurationName',
        controller: 'ImportCtrl',
        controllerAs: 'configImport',
        resolve: { configuration: getConfiguration }
      });
  }

  /** @ngInject */
  function getProjects(resource) {
    return resource.getProjectList();
  }

  /** @ngInject */
  function getConfiguration($stateParams, configuration) {
    var configurationName = $stateParams.configurationName;
    return configuration.getByName(configurationName);
  }

  /** @ngInject */
  function ImportCtrl($state, projectservice, projectList, configuration, $mdDialog) {
    var configImport = this;

    configImport.configuration = configuration;

    if (!configuration.plugins) {
      // @todo this is an mpty configuration. We shouldn't let the user do
      // anything with this.
    }

    $mdDialog.show({
      parent: angular.element(document.body),
      templateUrl: 'app/projects/configuration-preview.html',
      controller: DialogCtrl,
      controllerAs: 'dialog',
      bindToController: true
    });

    function DialogCtrl() {
      var dialog = this;

      dialog.projects = projectList;
      dialog.overwriteProjectConfig = overwriteProjectConfig;

      function overwriteProjectConfig(projectId) {
        projectservice.load(projectId)
          .then(function(project) {
            return project.importPlugins(configuration.plugins);
          })
          .then(function() {
            $mdDialog.hide();
            $state.go('project', { projectId: projectId });
          });
      }
    }
  }

})();
