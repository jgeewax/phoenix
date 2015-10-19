(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('PluginCtrl', PluginCtrl);

  /** @ngInject */
  function PluginCtrl($scope, $plugin) {
    $scope.$plugin = $plugin;
  }
}());
