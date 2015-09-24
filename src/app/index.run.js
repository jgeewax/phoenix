(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $urlRouter, GAuth, GData, CLIENT_ID) {
    GAuth.setClient(CLIENT_ID);

    $rootScope.$on('$stateChangeError', function() {
      console.log(arguments);
    });

    $rootScope.$on('$locationChangeSuccess', function(e) {
      if (GData.isLogin()) {
        return;
      }

      e.preventDefault();

      GAuth.checkAuth().then(null, function() {
        return GAuth.login();
      }).then(function() {
        $urlRouter.sync();
      });
    });

    $urlRouter.listen();
  }

})();
