(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('DashboardCtrl', DashboardCtrl);

  /** @ngInject */
  function DashboardCtrl($scope, $dashboard) {
    $scope.$dashboard = $dashboard;
  }
}());
