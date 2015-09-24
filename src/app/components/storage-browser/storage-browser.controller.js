/* global document:true */
(function() {
  'use strict';

  var mod = angular
    .module('gcloudConsole')
    .controller('StorageBrowserCtrl', StorageBrowserCtrl);

  /** @ngInject */
  function StorageBrowserCtrl($mdDialog, $stateParams, GApi) {
    var plugin = this;

    plugin.refresh = getBuckets;
    plugin.createBucket = createBucket;

    GApi.load('storage', 'v1');
    getBuckets();

    function getBuckets() {
      GApi.executeAuth('storage', 'buckets.list', {
        project: $stateParams.projectId
      }).then(function(buckets) {
        plugin.buckets = buckets.items;
      });
    }

    function createBucket($event) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: 'app/components/storage-browser/storage-browser-dialog.html',
        controller: BucketCtrl,
        controllerAs: 'bucket',
        bindToController: true
      });
    }

    function BucketCtrl() {
      var bucket = this;

      bucket.create = create;
      bucket.cancel = closeDialog;
      bucket.storageClass = false;
      bucket.location = 'US';

      function create() {
        GApi.executeAuth('storage', 'buckets.insert', {
          project: $stateParams.projectId,
          name: bucket.name
        })
        .then(function(newBucket) {
          plugin.buckets.push(newBucket);
        })
        .then(closeDialog);
      }

      function closeDialog() {
        $mdDialog.hide();
      }
    }
  }

  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
}());
