(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(config);

  /** @ngInject */
  function config($urlRouterProvider, $mdThemingProvider) {
    $urlRouterProvider.deferIntercept();

    $urlRouterProvider.otherwise(function($injector) {
      var GData = $injector.get('GData');
      return GData.isLogin() ? '/projects' : '/login';
    });

    var consolePalette = $mdThemingProvider.extendPalette('grey', {
      '0': '#9e9e9e',
      '500': '#fafafa'
    });

    $mdThemingProvider.definePalette('consolePalette', consolePalette);

    $mdThemingProvider.theme('default')
      .primaryPalette('consolePalette')
      .accentPalette('blue');
  }

})();
