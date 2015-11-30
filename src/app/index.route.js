(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope) {
    $rootScope.$on('$stateChangeSuccess', function(e, toState) {
      $rootScope.ACTIVE_STATE = toState;
    });
  }

})();
