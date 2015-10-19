(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('ProjectCtrl', ProjectCtrl);

  /** @ngInject */
  function ProjectCtrl($scope, $project) {
    $scope.$project = $project;
  }
}());
