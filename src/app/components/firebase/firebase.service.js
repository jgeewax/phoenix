/* global Firebase:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('firebaseDriver', firebaseDriver);

  /** @nginject */
  function firebaseDriver($rootScope, GAuth, $firebaseAuth, $firebaseArray, $firebaseObject, $firebaseUtils, $q) {
    var rootRef = new Firebase('https://phoenix-storage.firebaseio.com');
    var $auth = $firebaseAuth(rootRef);

    function isAuthenticated() {
      var authData = $auth.$getAuth();
      return !!authData;
    }

    function getUserId() {
      var authData = $auth.$getAuth();
      return authData.uid;
    }

    function auth() {
      if (isAuthenticated()) {
        return $q.resolve();
      }

      return GAuth.getToken().then(function(tokenObject) {
        var token = tokenObject.access_token;
        return $auth.$authWithOAuthToken('google', token);
      });
    }

    function exists($ref) {
      return $ref.$loaded().then(function(data) {
        // http://stackoverflow.com/questions/25778059/how-to-check-if-the-object-exists-in-firebase-using-angularfire-asobject
        return $q.resolve(data.$value !== null);
      });
    }

    function object(path) {
      var ref = rootRef.child(path.join('/').replace(':', '_'));
      return $firebaseObject(ref);
    }

    function getPopularDashboards() {
      var ref = rootRef.child('dashboards')
        .orderByPriority()
        .startAt(1);

      return $firebaseObject(ref);
    }

    function getGlobalDashboards() {
      return object(['dashboards']);
    }

    function getGlobalDashboard(dashboardId) {
      return object([
        'dashboards',
        dashboardId
      ]);
    }

    function getDashboards(projectId) {
      if (!projectId) {
        return getGlobalDashboards();
      }

      return object([
        'projects',
        projectId,
        'dashboards'
      ]);
    }

    function getDashboard(options) {
      var projectId = options.projectId;
      var dashboardId = options.dashboardId;

      if (!projectId) {
        return getGlobalDashboard(dashboardId);
      }

      return object([
        'projects',
        projectId,
        'dashboards',
        dashboardId
      ]);
    }

    function getPlugin(options) {
      var projectId = options.projectId;
      var dashboardId = options.dashboardId;
      var pluginId = options.pluginId;

      return object([
        'projects',
        projectId,
        'dashboards',
        dashboardId,
        'plugins',
        pluginId
      ]);
    }

    function save($ref, newData) {
      angular.extend($ref, $firebaseUtils.toJSON(newData), {
        creator: getUserId()
      });
      return $ref.$save();
    }

    return {
      auth: auth,
      isAuthenticated: isAuthenticated,
      getUserId: getUserId,

      exists: exists,

      getPopularDashboards: getPopularDashboards,
      getGlobalDashboards: getGlobalDashboards,
      getGlobalDashboard: getGlobalDashboard,

      getDashboards: getDashboards,
      getDashboard: getDashboard,
      getPlugin: getPlugin,

      save: save
    };
  }
}());

// {
//   "projects": {
//     "$project_id": {
//       "users": {
//         "$user_id": {
//           // Private user dashboards
//           "dashboards": {
//             "$dashboard_id": {
//               "name": "Dashboard Name",
//               "modified": new Date(),
//               "plugins": {
//                 "storage-browser": {
//                   "title": "Storage Browser",
//                   "state": "storage-browser",
//                   "repository": "jgeewax/gcloud-ui-storage-browser",
//                   "version": "v0.0.2",
//                   "id": "storage-browser"
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   },
//   "dashboards": {
//      // Public dashboards
//     "${dashboardId}": {
//       "creator": "${userId}",
//       "modified": new Date(),
//       "plugins": {
//         "storage-browser": {
//           "title": "Storage Browser",
//           "state": "storage-browser",
//           "repository": "jgeewax/gcloud-ui-storage-browser",
//           "version": "v0.0.2",
//           "id": "storage-browser"
//         }
//       }
//     }
//   }
// }
