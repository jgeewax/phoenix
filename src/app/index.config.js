(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .config(config);

  /** @ngInject */
  function config($mdThemingProvider, System) {
    var consolePalette = $mdThemingProvider.extendPalette('grey', {
      '0': '#9e9e9e',
      '500': '#fafafa'
    });

    $mdThemingProvider.definePalette('consolePalette', consolePalette);

    $mdThemingProvider.theme('default')
      .primaryPalette('consolePalette')
      .accentPalette('blue');

    System.config({
      paths: {
        "*": "*.js",
        "github:*": "https://github.jspm.io/*.js",
        "npm:*": "https://npm.jspm.io/*.js"
      }
    });
  }

})();
