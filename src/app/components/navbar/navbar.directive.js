(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .directive('navbar', navbar);

  /** @ngInject */
  function navbar() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        projects: '=',
        user: '='
      },
      templateUrl: 'app/components/navbar/navbar.html',
      controller: NavbarCtrl,
      controllerAs: 'navbar',
      bindToController: true
    };
  }

  /** @ngInject */
  function NavbarCtrl($state, $scope, Navbar, GAuth) {
    var DEFAULT_OPTION = 'Select a project';

    var navbar = this;
    var projects = navbar.projects;

    navbar.selectedProject = DEFAULT_OPTION;
    navbar.logout = logout;
    navbar.openSideNav = Navbar.openSideNav;
    navbar.hasSideNav = hasSideNav;

    $scope.$watch(getProjectId, setSelectedProject);

    function getProjectId() {
      return $state.params.projectId;
    }

    function setSelectedProject(projectId) {
      navbar.selectedProject = getProjectName(projectId) || DEFAULT_OPTION;
    }

    function getProjectName(id) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].projectId === id) {
          return projects[i].name;
        }
      }
    }

    function logout() {
      return GAuth.logout().then(function() {
        $state.go('login');
      });
    }

    function hasSideNav() {
      return !!Navbar.getSideNav();
    }
  }
}());
