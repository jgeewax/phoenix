/* global setTimeout:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(pluginRoutes);

  /** @ngInject */
  function pluginRoutes($stateProvider) {
    $stateProvider.state('plugin', {
      parent: 'dashboard',
      url: '/:pluginId',
      template: '<div ui-view flex layout="column"></div>',
      controller: 'PluginCtrl',
      controllerAs: 'plugin',
      resolve: { $plugin: getPlugin }
    });
  }

  /** @ngInject */
  function getPlugin($dashboard, $state, $stateParams) {
    var pluginId = $stateParams.pluginId;

    return $dashboard
      .loadPlugin(pluginId)
      .then(function() {
        setTimeout(angular.bind($state, $state.go), 0, pluginId);
        return $dashboard.getPlugin(pluginId);
      });
  }
}());
