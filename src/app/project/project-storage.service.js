/* global localStorage:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('firebaseDriver', firebaseDriver)
    .factory('localStorageDriver', localStorageDriver)
    .factory('projectStorage', projectStorage);

  /** @ngInject */
  function projectStorage($injector, $q) {
    function ProjectStorage(config) {
      if (!(this instanceof ProjectStorage)) {
        return new ProjectStorage(config);
      }

      this.driver = $injector.get(config.driver + 'Driver')(config.projectId);
      this.cache = null;
    }

    ProjectStorage.prototype.setItem = function(key, value) {
      var driver = this.driver;

      return this._getCache().then(function(cache) {
        cache[key] = value;

        return driver.write(cache);
      });
    };

    ProjectStorage.prototype.getItem = function(key) {
      return this._getCache().then(function(cache) {
        return cache[key];
      });
    };

    ProjectStorage.prototype._getCache = function() {
      if (this.cache) {
        return $q.resolve(this.cache);
      }

      var self = this;

      return this.driver.read().then(function(data) {
        return (self.cache = data);
      });
    };

    return ProjectStorage;
  }

  /** @ngInject */
  function firebaseDriver($q, firebase, GData) {
    var userId = GData.getUser().id;

    function FirebaseDriver(projectId) {
      if (!(this instanceof FirebaseDriver)) {
        return new FirebaseDriver(projectId);
      }

      var url = 'https://phoenix-storage.firebaseio.com/projects/' + projectId + '/users/' + userId;
      this.getRef = firebase.getRef(url);
    }

    FirebaseDriver._sanitize = function(data) {
      data = angular.copy(data);
      data.lastModified = new Date().toJSON();
      return data;
    };

    FirebaseDriver.prototype.write = function(data) {
      var deferred = $q.defer();

      this.getRef.then(function(ref) {
        ref.set(FirebaseDriver._sanitize(data), function(err) {
          if (err) {
            deferred.reject(err);
            return;
          }

          deferred.resolve();
        });
      });

      return deferred.promise;
    };

    FirebaseDriver.prototype.read = function() {
      var deferred = $q.defer();

      this.getRef.then(function(ref) {
        ref.once('value', function(snap) {
          deferred.resolve(snap.val() || {});
        });
      });

      return deferred.promise;
    };

    return FirebaseDriver;
  }

  /** @ngInject */
  function localStorageDriver($q) {
    function LocalStorageDriver(projectId) {
      if (!(this instanceof LocalStorageDriver)) {
        return new LocalStorageDriver(projectId);
      }

      this.projectId = projectId;
    }

    LocalStorageDriver.prototype.write = function(data) {
      localStorage.setItem(this.projectId, JSON.stringify(data));
      return $q.resolve();
    };

    LocalStorageDriver.prototype.read = function() {
      var data = JSON.parse(localStorage.getItem(this.projectId) || '{}');
      return $q.resolve(data);
    };

    return LocalStorageDriver;
  }

}());
