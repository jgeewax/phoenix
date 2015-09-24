(function() {
  'use strict';

  var mod = angular
    .module('gcloudConsole')
    .controller('StorageBrowserCtrl', StorageBrowserCtrl);

  function StorageBrowserCtrl($stateParams, GApi) {
    var plugin = this;

    GApi.load('storage', 'v1');

    GApi.executeAuth('storage', 'buckets.list', {
      project: $stateParams.projectId
    }).then(function(buckets) {
      plugin.buckets = buckets.items;
    });
  }

  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
}());
