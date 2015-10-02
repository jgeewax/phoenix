(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(config);

  /** @ngInject */
  function config($mdThemingProvider) {
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
