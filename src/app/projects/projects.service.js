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

    $Projects.prototype._getByProjectId = function(projectId) {
      var length = this.list.length;
      var i = 0;

      for (; i < length; i++) {
        if (this.list[i].projectId === projectId) {
          return this.list[i];
        }
      }

      return null;
    };

    $Projects.prototype.getProject = function(projectId) {
      var project = this._getByProjectId(projectId);

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
