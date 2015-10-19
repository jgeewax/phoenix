(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Projects', $projectsFactory);

  /** @ngInject */
  function $projectsFactory($q, $Project, storage) {
    function $Projects(list) {
      if (!(this instanceof $Projects)) {
        return new $Projects(list);
      }

      this.list = list;
    }

    $Projects.prototype.getProject = function(projectId) {
      var project = _.findWhere(this.list, { projectId: projectId });

      if (!project) {
        return $q.reject('Unknown project "' + projectId + '"');
      }

      return storage.getItem(projectId)
        .then(null, function() {
          return ['default'];
        })
        .then(function(dashboards) {
          return new $Project(project, dashboards);
        });
    };

    return $Projects;
  }
}());
