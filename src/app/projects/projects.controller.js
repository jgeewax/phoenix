(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('ProjectsCtrl', ProjectsCtrl);

  function ProjectsCtrl(projectList) {
    var projects = this;

    projects.list = projectList;
  }
}());
