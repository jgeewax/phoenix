(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('Navbar', Navbar);

  /** @ngInject */
  function Navbar() {
    var sidenav;

    function getSideNav() {
      return sidenav;
    }

    function setSideNav(_sidenav) {
      sidenav = _sidenav;
    }

    function openSideNav() {
      if (sidenav) {
        sidenav.open();
      }
    }

    function closeSideNav() {
      if (sidenav) {
        sidenav.close();
      }
    }

    return {
      getSideNav: getSideNav,
      setSideNav: setSideNav,
      openSideNav: openSideNav,
      closeSideNav: closeSideNav
    };
  }
}());
