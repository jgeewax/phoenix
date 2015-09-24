(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .directive('pluginController', plugin);

  function plugin($compile, $interpolate) {
    var ctrl = $interpolate('{{controller}} as plugin');
    var view = $interpolate('"{{view}}"');

    return {
      restrict: 'A',
      scope: {
        controller: '=pluginController',
        view: '=pluginView'
      },
      link: function(scope, elem) {
        elem.attr('ng-controller', ctrl(scope));
        elem.removeAttr('plugin-controller');

        elem.attr('ng-include', view(scope));
        elem.removeAttr('plugin-view');

        $compile(elem)(scope);
      }
    };
  }
}());
