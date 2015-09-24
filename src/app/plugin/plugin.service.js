(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$gcPlugin', $gcPlugin);

  /** @ngInject */
  function $gcPlugin($q, $ocLazyLoad, System) {
    function arrayify(thing) {
      return angular.isArray(thing) ? thing : [thing];
    }

    function load(src) {
      var imports = arrayify(src).map(function(file) {
        return System.import(file);
      });

      return $q.all(imports).then(function(mod) {
        return $ocLazyLoad.inject(mod);
      });
    }

    return {
      load: load
    };
  }
}());
