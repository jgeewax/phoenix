(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('PluginCtrl', PluginCtrl);

  /** @ngInject */
  function PluginCtrl($scope, $plugin, $state) {
    $scope.$plugin = $plugin;
    $state.go($plugin.state);
  }
}());
