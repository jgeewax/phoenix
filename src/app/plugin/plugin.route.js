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

    function getDefaultState() {
      return { state: pluginId };
    }

    function getPluginFiles($plugin) {
      var hasState = !!$state.get(pluginId);

      if (hasState) {
        return $plugin;
      }

      return $dashboard
        .loadPlugin($plugin.state)
        .then(function() {
          return $plugin;
        });
    }

    return $dashboard
      .getPlugin(pluginId)
      .then(null, getDefaultState)
      .then(getPluginFiles);
  }
}());
