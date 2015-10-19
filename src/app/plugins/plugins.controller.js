(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('PluginsCtrl', PluginsCtrl);

  /** @ngInject */
  function PluginsCtrl(pluginList) {
    var plugins = this;

    plugins.list = pluginList;
  }
}());
