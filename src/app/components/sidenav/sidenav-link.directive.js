(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .directive('sidenavLink', sidenavLink);

  /** @ngInject */
  function sidenavLink() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/sidenav/sidenav-link.html',
      require: '^sidenav',
      link: sidenavLinkLink,
      transclude: true
    };
  }

  // what a terrible name!
  function sidenavLinkLink(scope, elem, attrs, sidenavCtrl) {
    elem.on('click', function(e) {
      if (elem.hasClass('sidenav-link-active')) {
        e.preventDefault();
      }

      sidenavCtrl.close();
    });
  }
}());
