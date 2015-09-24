(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('PluginCtrl', PluginCtrl);

  /** @ngInject */
  function PluginCtrl(plugin) {
    angular.extend(this, plugin);
  }
}());
