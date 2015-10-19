(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('DashboardCtrl', DashboardCtrl);

  /** @ngInject */
  function DashboardCtrl($scope, $dashboard, $mdToast, $mdDialog) {
    var dashboard = this;

    $scope.$dashboard = $dashboard;

    dashboard.configure = configure;
    dashboard.clone = clone;
    dashboard.remove = remove;

    function configure(plugin, isUpdate) {
      var copy = angular.copy(plugin);

      if (!isUpdate) {
        copy.title = getUniqueName(copy.title);
      }

      return $mdDialog.show({
        controller: PluginConfigCtrl,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'app/dashboard/plugin-config.html',
        locals: { plugin: copy }
      });
    }

    function PluginConfigCtrl() {
      var vm = this;
      var pluginTitle = vm.plugin.title;

      vm.close = $mdDialog.hide;
      vm.save = save;

      function save() {
        return $dashboard
          .updatePlugin(pluginTitle, vm.plugin)
          .then(vm.close);
      }
    }

    function clone(plugin) {
      return configure(plugin, false);
    }

    function getUniqueName(name) {
      if (!$dashboard.getPluginByTitle(name)) {
        return name;
      }

      var i = 0;
      var title;

      while (++i) {
        title = name + ' ' + i;

        if (!$dashboard.getPluginByTitle(title)) {
          return title;
        }
      }
    }

    function remove(plugin) {
      return $dashboard
        .removePlugin(plugin)
        .then(showUndoToast)
        .then(function(action) {
          if (action === 'ok') {
            return $dashboard.addPlugin(plugin);
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
