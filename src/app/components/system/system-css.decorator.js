/* global document:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .decorator('System', cssPlugin);

  /** @ngInject */
  function cssPlugin($delegate, $q) {
    var fetch = $delegate.fetch;

    var rCss = /\.css/;

    $delegate.fetch = function(load) {
      if (!rCss.test(load.address)) {
        return fetch.apply(this, arguments);
      }

      var defer = $q.defer();
      var link = document.createElement('link');

      link.rel = 'stylesheet';

      link.onload = function() {
        defer.resolve('');
      };

      link.onerror = function(e) {
        defer.reject(e);
      };

      document.head.appendChild(link);
      link.href = load.address;

      return defer.promise;
    };

    return $delegate;
  }
}());
