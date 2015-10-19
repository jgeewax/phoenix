(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('ProjectsCtrl', ProjectsCtrl);

  function ProjectsCtrl($scope, $projects) {
    $scope.$projects = $projects;
  }
}());
