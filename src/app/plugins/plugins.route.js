(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('plugins', {
        parent: 'dashboard',
        controller: 'PluginsCtrl',
        controllerAs: 'plugins',
        url: '/plugins',
        templateUrl: 'app/plugins/plugins.html',
        resolve: { pluginList: getPluginList }
      });
  }

  /** @ngInject */
  function getPluginList($http, projectCache) {
    return $http.get('plugins.json', { cache: projectCache })
      .then(function(response) {
        return response.data;
      });
  }
}());
