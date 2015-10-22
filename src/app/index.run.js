(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .run(runBlock);

  /** @ngInject */
  function runBlock($q, $rootScope, $urlRouter, $injector, firebaseDriver, GAuth, GData, CLIENT_ID, CLOUD_SCOPE) {
    GAuth.setClient(CLIENT_ID);
    GAuth.setScope(CLOUD_SCOPE);

    $rootScope.$on('$stateChangeError', function() {
      console.log(arguments);
    });

    $rootScope.$on('$locationChangeSuccess', function(e) {
      if (GData.isLogin() && firebaseDriver.isAuthenticated()) {
        return;
      }

      e.preventDefault();

      GAuth.checkAuth()
        .then(firebaseDriver.auth)
        .then(function() {
          $urlRouter.sync();
        }, function() {
          $injector.get('$state').go('login');
        });
    });

    $urlRouter.listen();
  }

})();
