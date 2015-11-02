(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .directive('ifAvailable', ifAvailable);

  /** @ngInject */
  function ifAvailable($q, firebaseDriver) {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        getRef: '='
      },
      link: function(scope, element, attrs, ctrl) {
        ctrl.$asyncValidators.ifAvailable = function(value) {
          return firebaseDriver.exists(scope.getRef(value))
            .then(function(exists) {
              if (exists) {
                return $q.reject();
              } else {
                return $q.resolve();
              }
            });
        };
      }
    };
  }
}());
