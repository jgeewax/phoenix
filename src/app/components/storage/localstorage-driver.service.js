/* global localStorage:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('localStorageDriver', localStorageDriver);

  function localStorageDriver($q) {
    function write(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        return $q.resolve();
      } catch (e) {
        return $q.reject(e);
      }
    }

    function read(key) {
      try {
        var data = JSON.parse(localStorage.getItem(key));
        return $q.resolve(data);
      } catch (e) {
        return $q.reject(e);
      }
    }

    return {
      write: write,
      read: read
    };
  }
}());
