(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .service('configuration', Configuration);

  function Configuration($q, GData, firebase) {
    this.userId = GData.getUser().id;
    this.$q = $q;

    var url = 'https://phoenix-storage.firebaseio.com/configurations';
    this.getRef = firebase.getRef(url);
  }

  Configuration.prototype.getByName = function(name) {
    var deferred = this.$q.defer();

    this.getRef.then(function(configRef) {
      configRef.child(name).once('value', function(snap) {
        var configuration = snap.val();

        if (!configuration) {
          deferred.reject(new Error('Configuration not found.'));
          return;
        }

        deferred.resolve(configuration);
      });
    });

    return deferred.promise;
  };

  Configuration.prototype.setByName = function(name, plugins) {
    var deferred = this.$q.defer();

    var data = {
      lastModified: new Date().toJSON(),
      creator: this.userId,
      plugins: plugins
    };

    this.getRef.then(function(configRef) {
      configRef.child(name).set(data, function(err) {
        if (err) {
          deferred.reject(err);
          return;
        }

        deferred.resolve();
      });
    });

    return deferred.promise;
  };

}());
