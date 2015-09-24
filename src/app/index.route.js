(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(routeConfig);

  /** @ngInject */
  function routeConfig($urlRouterProvider) {
    $urlRouterProvider.deferIntercept();

    $urlRouterProvider.otherwise(function($injector) {
      var GData = $injector.get('GData');
      return GData.isLogin() ? '/projects' : '/login';
    });
  }

})();
