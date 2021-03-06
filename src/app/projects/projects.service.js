(function() {
  /* jshint newcap:false */
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('$Projects', $projectsFactory);

  /** @ngInject */
  function $projectsFactory($q, $Project) {
    function $Projects(projects) {
      if (!(this instanceof $Projects)) {
        return new $Projects(projects);
      }

      projects = projects || [];

      this.projects = projects.reduce(function(acc, project) {
        acc[project.projectId] = project;
        return acc;
      }, {});
    }

    $Projects.prototype.getProject = function(id) {
      return new $Project(this.projects[id]);
    };

    return $Projects;
  }
}());
