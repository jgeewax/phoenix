(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('projectCache', projectCache);

  /** @ngInject */
  function projectCache($cacheFactory) {
    return $cacheFactory('projectCache');
  }
}());
