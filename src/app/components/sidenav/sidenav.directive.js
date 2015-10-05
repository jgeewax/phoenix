/**
 * This file serves as a way to connect a sidenav to the main project nav
 */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .directive('sidenav', sidenav);

  /** @ngInject */
  function sidenav() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/components/sidenav/sidenav.html',
      transclude: true,
      controller: SidenavCtrl,
      controllerAs: 'sidenav'
    };
  }

  /** @ngInject */
  function SidenavCtrl($scope, $timeout, $mdSidenav, $mdMedia, Navbar) {
    var sidenav = this;
    var $sidenav, timeoutHandle;

    sidenav.close = close;
    sidenav.isMobileView = isMobileView;

    timeoutHandle = $timeout(function() {
      $sidenav = $mdSidenav('side-nav');
      Navbar.setSideNav($sidenav);
    });

    $scope.$on('$destroy', unlinkSideNav);

    function unlinkSideNav() {
      $timeout.cancel(timeoutHandle);
      Navbar.setSideNav(null);
    }

    function close() {
      $sidenav.close();
    }

    function isMobileView() {
      return !$mdMedia('gt-md');
    }
  }
}());
