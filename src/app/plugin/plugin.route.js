(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(pluginRoutes);

  /** @ngInject */
  function pluginRoutes($stateProvider) {
    $stateProvider.state('plugin', {
      parent: 'dashboard',
      url: '/plugin/:pluginId',
      template: '<div ui-view flex layout="column"></div>',
      controller: 'PluginCtrl',
      controllerAs: 'plugin',
      resolve: { $plugin: getPlugin }
    });
  }

  /** @ngInject */
  function getPlugin($dashboard, $state, $stateParams) {
    var pluginId = $stateParams.pluginId;
    var $plugin = $dashboard.getPlugin(pluginId);

    return $plugin.load()
      .then(function() {
        return $plugin.read();
      }, function() {
        $state.go('dashboard', $plugin);
      });
  }
}());
