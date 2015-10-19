(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Plugin', $pluginFactory);

  /** @ngInject */
  function $pluginFactory() {
    function $Plugin(metadata) {
      if (!(this instanceof $Plugin)) {
        return new $Plugin(metadata);
      }

      angular.extend(this, metadata);
    }

    return $Plugin;
  }
}());
