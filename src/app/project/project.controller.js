(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('ProjectCtrl', ProjectCtrl);

  function ProjectCtrl(plugins, string) {
    var project = this;

    project.plugins = plugins.map(function(plugin) {
      return {
        slug: string.slug(plugin.name),
        title: string.title(plugin.name)
      };
    });
  }
}());
