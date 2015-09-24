(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('PluginCtrl', PluginCtrl);

  /** @ngInject */
  function PluginCtrl(plugin, project) {
    angular.extend(this, plugin);
  }
}());
