(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('plugin', {
        parent: 'project',
        url: '/:pluginId',
        templateUrl: 'app/plugin/plugin.html',
        controller: 'PluginCtrl',
        controllerAs: 'plugin',
        resolve: { plugin: getPlugin }
      });
  }

  /** @ngInject */
  function getPlugin($gcPlugin) {
    /**
     * This is all hardcoded for now, since no plugins current exist..
     * however it would essentially work by taking the pluginId state
     * param and passing that to $gcPlugin which would in turn give back
     * the controller/template stuff..
     */
    return $gcPlugin.load('app/components/storage-browser/storage-browser.controller')
      .then(function() {
        return {
          controller: 'StorageBrowserCtrl',
          templateUrl: 'app/components/storage-browser/storage-browser.html'
        };
      });
  }

})();
