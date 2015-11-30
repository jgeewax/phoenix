/* global getSlug:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('ProjectsCtrl', ProjectsCtrl);

  /* @ngInject */
  function ProjectsCtrl($rootScope, $projects, $mdDialog, $mdToast, $firebaseUtils, firebaseDriver) {
    var projects = this;
    var userId = firebaseDriver.getUserId();

    projects.map = $projects.projects;

    angular.forEach(projects.map, function(project, projectId) {
      project.dashboards = getDashboardsForProject(projectId);
    });

    function getDashboardsForProject(projectId) {
      var allDashboards = $projects.getProject(projectId).dashboards.$data;

      var dashboardsObj = {
        others: {},
        othersCount: 0,
        self: {},
        selfCount: 0
      };

      allDashboards.$watch(function() {
        var dashboards = $firebaseUtils.toJSON(allDashboards);

        dashboardsObj.others = {};
        dashboardsObj.othersCount = 0;

        dashboardsObj.self = {};
        dashboardsObj.selfCount = 0;

        for (var dashboardId in dashboards) {
          var dashboard = dashboards[dashboardId];
          if (dashboard.creator === userId) {
            dashboardsObj.self[dashboardId] = dashboard;
            dashboardsObj.selfCount++;
          } else {
            dashboardsObj.others[dashboardId] = dashboard;
            dashboardsObj.othersCount++;
          }
        }
      });

      return dashboardsObj;
    }

    projects.createDashboard = createDashboard;
    projects.deleteDashboard = deleteDashboard;
    projects.shareDashboard = shareDashboard;

    function createDashboard(projectId) {
      var $project = $projects.getProject(projectId);

      $mdDialog.show({
        parent: angular.element(document.body),
        templateUrl: 'app/projects/add-dashboard-dialog.html',
        controller: DialogCtrl,
        controllerAs: 'dialog',
        bindToController: true
      });

      /** @ngInject */
      function DialogCtrl($state, $scope, $timeout, $q, firebaseDriver) {
        var dialog = this;
        var timeoutHandle;

        dialog.name = 'My Custom Dashboard';

        dialog.create = create;
        dialog.importDash = importDash;
        dialog.getRef = getRef;
        dialog.close = closeDialog;
        dialog.popularDashboards = firebaseDriver.getPopularDashboards();
        dialog.selectDashboard = selectDashboard;

        $scope.$watch('dialog.code', function(code) {
          if (!code) {
            return;
          }

          $timeout.cancel(timeoutHandle);

          timeoutHandle = $timeout(function() {
            $projects.getDashboard(code)
              .read()
              .then(function(data) {
                if (!data.name) {
                  return $q.reject('Dashboard not found');
                }

                dialog.import = data;
                $scope.importDashboard.code.$error.exists = false;
              })
              .then(null, function() {
                // eh.. this could be better handled
                dialog.import = null;
                $scope.importDashboard.code.$error.exists = true;
              });
          }, 1000);
        });

        function importDash() {
          return $project.createDashboard(dialog.import.name, dialog.import.plugins)
            .then(closeDialog, function() {
              var errorToast = $mdToast.simple()
                .content('Unable to import Dashboard')
                .action('Ok');

              return $mdToast.show(errorToast);
            });
        }

        function create() {
          return $project.createDashboard(dialog.name, dialog.plugins)
            .then(closeDialog, function() {
              var errorToast = $mdToast.simple()
                .content('Unable to create Dashboard')
                .action('Ok');

              return $mdToast.show(errorToast);
            });
        }

        function getRef(name) {
          return $project.getDashboard(getSlug(name)).$dataRef;
        }

        function closeDialog() {
          $mdDialog.hide();
        }

        function selectDashboard(dashboardId, dashboardData) {
          if (dialog.inheritFrom === dashboardId) {
            dialog.inheritFrom = null;
            dialog.plugins = [];
          } else {
            dialog.inheritFrom = dashboardId;
            dialog.plugins = dashboardData.plugins;
          }
        }
      }
    }

    function deleteDashboard(projectId, dashboardId) {
      var $project = $projects.getProject(projectId);
      var $dashboard = $project.getDashboard(dashboardId);

      return $dashboard.remove()
        .then(function() {
          return $mdToast.simple().content('Dashboard deleted');
        }, function() {
          return $mdToast.simple().content('Unable to delete Dashboard');
        })
        .then(function(options) {
          return $mdToast.show(options.action('ok'));
        });
    }

    function shareDashboard(projectId, dashboardId) {
      var $project = $projects.getProject(projectId);
      var $dashboard = $project.getDashboard(dashboardId);

      var newDashboardId = dashboardId + '-' + Date.now();

      return $dashboard.read()
        .then(function(data) {
          var $globalDashboard = $projects.getDashboard(newDashboardId);
          return $globalDashboard.save(data);
        })
        .then(function() {
          return $mdDialog.show({
            templateUrl: 'app/projects/code-dialog.html',
            controller: function() {
              this.close = angular.bind($mdDialog, $mdDialog.hide);
            },
            controllerAs: 'dialog',
            locals: { code: newDashboardId },
            bindToController: true
          });
        });
    }
  }
}());
