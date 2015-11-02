/* global setTimeout:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .directive('textSelected', textSelected);

  /** @ngInject */
  function textSelected() {
    return {
      restrict: 'A',
      priority: 1,
      link: textSelectedLink
    };
  }

  function textSelectedLink(scope, elem) {
    var el = elem[0];

    setTimeout(angular.bind(el, el.select), 500);
  }
}());
