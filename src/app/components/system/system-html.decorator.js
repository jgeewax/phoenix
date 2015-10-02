(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .decorator('System', htmlPlugin);

  /** @ngInject */
  function htmlPlugin($delegate, $http, $templateCache) {
    var fetch = $delegate.fetch;

    var rHtml = /\.html/;
    var rFilepath = /^.*[\\\/]/;

    $delegate.fetch = function(load) {
      if (!rHtml.test(load.address)) {
        return fetch.apply(this, arguments);
      }

      return $http.get(load.address)
        .then(function(response) {
          var templateName = load.address.replace(rFilepath, '');
          $templateCache.put(templateName, response.data);
          return '';
        });
    };

    return $delegate;
  }
}());
