/* global localStorage:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
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
