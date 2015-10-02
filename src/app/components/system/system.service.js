/* global System:true */
// using a factory instead of a constant to leverage decorators
// for html/css plugins
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('System', SystemWrapper);

  /** @ngInject */
  function SystemWrapper() {
    System.config({
      paths: {
        "github:*": "https://github.jspm.io/*",
        "npm:*": "https://npm.jspm.io/*"
      }
    });

    return System;
  }
}());
