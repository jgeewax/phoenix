(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($stateProvider) {
    $stateProvider
      .state('login', {
        controller: 'LoginCtrl',
        controllerAs: 'mv',
        url: '/login',
        templateUrl: 'app/login/login.html'
      });
  }
}());
