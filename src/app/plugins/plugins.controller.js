(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('PluginsCtrl', PluginsCtrl);

  /** @ngInject */
  function PluginsCtrl(pluginList, $dashboard) {
    var plugins = this;

    plugins.list = pluginList;
    plugins.toggle = toggle;

    function toggle(plugin) {
      if (plugin.isEnabled) {
        $dashboard.addPlugin(plugin);
        return;
      }

      $dashboard.removePlugin(plugin);
    }
  }
}());
