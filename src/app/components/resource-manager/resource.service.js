(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('resource', resource);

  function resource($http, $cacheFactory, GAuth) {
    var SCOPE = 'https://www.googleapis.com/auth/cloud-platform';
    var BASE = 'https://cloudresourcemanager.googleapis.com/v1beta1';

    var cache = $cacheFactory('resource');

    function getRequestConfig(options, token) {
      return angular.extend({}, options, {
        headers: {
          Authorization: 'Bearer ' + token.access_token
        },
        url: BASE + options.url,
        method: options.method || 'GET',
        cache: cache
      });
    }

    function request(options) {
      GAuth.setScope(SCOPE);

      return GAuth.getToken()
        .then(function(token) {
          var requestConfig = getRequestConfig(options, token);
          return $http(requestConfig);
        });
    }

    function getProjectList() {
      return request({ url: '/projects' })
        .then(function(response) {
          return response.data.projects;
        });
    }

    return {
      getProjectList: getProjectList
    };
  }

}());
