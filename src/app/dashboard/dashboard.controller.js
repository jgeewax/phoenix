/* global getSlug:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('DashboardCtrl', DashboardCtrl);

  /** @ngInject */
  function DashboardCtrl($q, $scope, $state, $dashboard, $mdToast, $mdDialog) {
    var dashboard = this;

    $scope.$dashboard = $dashboard;

    dashboard.configure = configure;
    dashboard.clone = clone;
    dashboard.remove = remove;

    function configure(pluginId, plugin, isUpdate) {
      function getPluginConfig() {
        var pluginConfig = angular.copy(plugin);

        if (isUpdate) {
          return $q.resolve(pluginConfig);
        } else {
          return getUniquePluginConfig(pluginConfig);
        }
      }

      function PluginConfigCtrl(pluginConfig) {
        var vm = this; // `vm` for `view model`

        vm.plugin = pluginConfig;
        vm.close = $mdDialog.hide;
        vm.save = prepareSave;

        function prepareSave() {
          if (isUpdate) {
            // We don't have to find a unique plugin ID.
            return save(vm.plugin);
          } else {
            return getUniquePluginConfig(vm.plugin)
              .then(function(config) {
                pluginId = getSlug(config.title);
                return save(config);
              });
          }
        }

        function save(config) {
          var $plugin = $dashboard.getPlugin(pluginId);
          return $plugin.save(config).then(vm.close);
        }
      }

      return $mdDialog.show({
        controller: PluginConfigCtrl,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'app/dashboard/plugin-config.html',
        resolve: { pluginConfig: getPluginConfig }
      });
    }

    function getUniquePluginConfig(pluginConfig) {
      var originalTitle = pluginConfig.title;

      return $dashboard.read().then(function(data) {
        function exists(title) {
          if (data && data.plugins) {
            for (var plugin in data.plugins) {
              if (data.plugins[plugin].title === title ||
                  data.plugins[getSlug(title)]) {
                return true;
              }
            }
          }

          return false;
        }

        if (!exists(pluginConfig.title)) {
          // This title is fine.
          return pluginConfig;
        } else {
          var i = 0;

          while (++i) {
            pluginConfig.title = originalTitle + ' (' + i + ')';

            if (!exists(pluginConfig.title)) {
              return pluginConfig;
            }
          }
        }
      });
    }

    function clone(pluginId, pluginData) {
      return configure(pluginId, pluginData, false);
    }

    function remove(pluginId, pluginData) {
      var $plugin = $dashboard.getPlugin(pluginId);
      var pluginRouteIsActive = $state.params.pluginId === pluginId;

      return $plugin.delete()
        .then(function() {
          if (pluginRouteIsActive) {
            // They just invalidated this route, since this plugin no longer
            // exists. Return to the dashboard view.
            return $state.go('dashboard', {
              dashboardId: $dashboard.id
            });
          } else {
            return $q.resolve();
          }
        })
        .then(showUndoToast)
        .then(function(action) {
          if (action === 'ok') {
            // Go back to the plugin's page.
            return $plugin.save(pluginData)
              .then(function() {
                if (pluginRouteIsActive) {
                  return $state.go('plugin', {
                    pluginId: pluginId
                  });
                }
              });
          }
        });
    }

    function showUndoToast() {
      var toast = $mdToast.simple();

      toast.content('Plugin removed');
      toast.action('undo');

      return $mdToast.show(toast);
    }
  }
}());
