(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .controller('ProjectCtrl', ProjectCtrl);

  function ProjectCtrl($project, $mdDialog) {
    var project = this;

    project.shareConfiguration = shareConfiguration;

    project.plugins = $project.plugins;

    function shareConfiguration($event) {
      $mdDialog.show({
        parent: angular.element(document.body),
        targetEvent: $event,
        templateUrl: 'app/project/project-share-configuration-dialog.html',
        controller: DialogCtrl,
        controllerAs: 'dialog',
        bindToController: true
      });
    }

    function DialogCtrl() {
      var dialog = this;

      dialog.creating = true;
      dialog.name = 'my-config-name';

      dialog.share = share;
      dialog.close = closeDialog;

      function share() {
        return $project.shareConfiguration(dialog.name).then(showUrl);
      }

      function showUrl() {
        dialog.creating = false;
        dialog.url = 'http://' + window.location.host + window.location.pathname + '#/projects/import/' + dialog.name;
      }

      function closeDialog() {
        $mdDialog.hide();
      }
    }
  }
}());
