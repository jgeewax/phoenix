(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
