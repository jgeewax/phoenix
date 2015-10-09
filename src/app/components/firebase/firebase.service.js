/* global Firebase:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .service('firebase', FirebaseWrapper);

  function FirebaseWrapper($q, GAuth) {
    this.$q = $q;
    this.GAuth = GAuth;
  }

  FirebaseWrapper.prototype.getRef = function(url) {
    var ref = new Firebase(url);

    var deferred = this.$q.defer();

    if (ref.getAuth()) {
      deferred.resolve(ref);
      return deferred.promise;
    }

    this.GAuth.getToken().then(function(token) {
      var accessToken = token.access_token;

      ref.authWithOAuthToken('google', accessToken, function(err) {
        if (err) {
          deferred.reject(err);
          return;
        }

        deferred.resolve(ref);
      });
    });

    return deferred.promise;
  };

}());
