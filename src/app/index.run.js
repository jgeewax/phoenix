(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .run(runBlock);

  /** @ngInject */
  function runBlock($rootScope, $urlRouter, $injector, GAuth, GData, CLIENT_ID, CLOUD_SCOPE) {
    GAuth.setClient(CLIENT_ID);
    GAuth.setScope(CLOUD_SCOPE);

    $rootScope.$on('$stateChangeError', function() {
      console.log(arguments);
    });

    $rootScope.$on('$locationChangeSuccess', function(e) {
      if (GData.isLogin()) {
        return;
      }

      e.preventDefault();

      GAuth.checkAuth().then(function() {
        $urlRouter.sync();
      }, function() {
        $injector.get('$state').go('login');
      });
    });

    $urlRouter.listen();
  }

})();
