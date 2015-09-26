/* global document:true */
(function() {
  'use strict';

  var mod = angular
    .module('gcloudConsole')
    .config(routes)
    .controller('StorageBrowserCtrl', StorageBrowserCtrl);

  /** @ngInject */
  function routes($stateProvider) {
    $stateProvider
      .state('storage-browser', {
        url: '/storage-browser',
        parent: 'project',
        controller: 'StorageBrowserCtrl',
        controllerAs: 'browser',
        templateUrl: 'app/components/storage-browser/storage-browser.html',
        resolve: { buckets: getBuckets }
      });
  }

  /** @ngInject */
  function getBuckets($stateParams, GApi) {
    GApi.load('storage', 'v1');

    return GApi.executeAuth('storage', 'buckets.list', {
      project: $stateParams.projectId
    });
  }

  /** @ngInject */
  function StorageBrowserCtrl($q, $mdDialog, $stateParams, GApi, buckets) {
    var browser = this;

    // props
    browser.buckets = buckets.items;
    browser.selected = [];
    browser.filter = null;
    browser.filtering = false;

    // ui methods
    browser.isIdle = isIdle;
    browser.isSelected = isSelected;
    browser.getVerbiage = getVerbiage;

    // crud methods - refactor into service..?
    browser.refreshBuckets = refreshBuckets;
    browser.createBucket = createBucket;
    browser.deleteBuckets = deleteBuckets;

    function isIdle() {
      return !browser.filtering && !isSelected();
    }

    function isSelected() {
      return browser.selected.length > 0;
    }

    function getVerbiage() {
      return browser.selected.length === 1 ? 'item' : 'items';
    }

    function refreshBuckets() {
      return GApi.executeAuth('storage', 'buckets.list', {
        project: $stateParams.projectId
      }).then(function(buckets) {
        browser.buckets = buckets.items;
      });
    }

    function createBucket($event) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: 'app/components/storage-browser/storage-browser-dialog.html',
        controller: DialogCtrl,
        controllerAs: 'dialog',
        bindToController: true
      })
      .finally(refreshBuckets);
    }

    function deleteBuckets() {
      var requests = browser.selected.map(function(bucket) {
        return GApi.executeAuth('storage', 'buckets.delete', {
          project: $stateParams.projectId,
          bucket: bucket.name
        });
      });

      return $q.all(requests)
        .finally(refreshBuckets);
    }
  }

  /** @ngInject */
  function DialogCtrl($mdDialog, $stateParams, GApi) {
    var dialog = this;

    dialog.storageClass = false;
    dialog.location = 'US';

    dialog.createBucket = createBucket;
    dialog.close = closeDialog;

    function createBucket() {
      var options = {
        project: $stateParams.projectId,
        name: dialog.name,
        location: dialog.location
      };

      if (dialog.storageClass) {
        options.storageClass = dialog.storageClass;
      }

      return GApi.executeAuth('storage', 'buckets.insert', options)
        .then(closeDialog);
    }

    function closeDialog() {
      $mdDialog.hide();
    }
  }

  if (typeof module !== 'undefined') {
    module.exports = mod;
  }
}());
