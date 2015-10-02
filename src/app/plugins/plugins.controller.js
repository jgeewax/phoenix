(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('PluginsCtrl', PluginsCtrl);

  /** @ngInject */
  function PluginsCtrl(pluginList, $project) {
    var plugins = this;

    plugins.list = pluginList;
    plugins.toggle = toggle;

    function toggle(plugin) {
      if (plugin.isEnabled) {
        $project.addPlugin(plugin);
        return;
      }

      $project.removePlugin(plugin);
    }
  }
}());
