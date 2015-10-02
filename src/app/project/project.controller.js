(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('ProjectCtrl', ProjectCtrl);

  function ProjectCtrl($project) {
    var project = this;

    project.plugins = $project.plugins;
  }
}());
