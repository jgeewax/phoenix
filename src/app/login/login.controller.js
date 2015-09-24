(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('LoginCtrl', LoginCtrl);

  /** @ngInject */
  function LoginCtrl($state, GAuth) {
    var mv = this;

    mv.login = login;

    function login() {
      return GAuth.login().then(function() {
        $state.go('projects');
      });
    }
  }
}());
