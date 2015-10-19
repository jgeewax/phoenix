(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .provider('storage', storageProvider);

  /** @ngInject */
  function storageProvider() {
    var driverName = 'localStorage';

    this.setStorageDriver = setStorageDriver;
    this.$get = createProjectStorage;

    function setStorageDriver(_driverName) {
      driverName = _driverName;
    }

    /** @ngInject */
    function createProjectStorage($injector) {
      var driver = $injector.get(driverName + 'Driver');

      function setItem(key, value) {
        return driver.write(key, value);
      }

      function getItem(key) {
        return driver.read(key);
      }

      return {
        setItem: setItem,
        getItem: getItem
      };
    }
  }

}());
