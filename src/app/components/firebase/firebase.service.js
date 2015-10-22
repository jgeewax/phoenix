/* global Firebase:true */
(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('firebaseDriver', firebaseDriver);

  /** @nginject */
  function firebaseDriver(GAuth, $firebaseAuth, $firebaseArray, $firebaseObject, $q) {
    var userId;

    var rootRef = new Firebase('https://phoenix-storage.firebaseio.com');
    var $auth = $firebaseAuth(rootRef);

    function isAuthenticated() {
      var authData = $auth.$getAuth();

      if (authData) {
        userId = authData.uid;
        return true;
      }
    }

    function auth() {
      if (isAuthenticated()) {
        return $q.resolve();
      }

      return GAuth.getToken().then(function(tokenObject) {
        var token = tokenObject.access_token;

        return $auth.$authWithOAuthToken('google', token)
          .then(function(data) {
            userId = data.uid;
            return data;
          });
      });
    }

    function object(path) {
      var ref = rootRef.child(path.join('/'));
      return $firebaseObject(ref);
    }

    function getMyDashboards(projectId) {
      return object([
        'projects',
        projectId,
        'users',
        userId,
        'dashboards'
      ]);
    }

    function getMyDashboard(options) {
      var projectId = options.projectId;
      var dashboardId = options.dashboardId;

      return object([
        'projects',
        projectId,
        'users',
        userId,
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
        'users',
        userId,
        'dashboards',
        dashboardId,
        'plugins',
        pluginId
      ]);
    }

    return {
      isAuthenticated: isAuthenticated,
      auth: auth,

      getMyDashboards: getMyDashboards,
      getMyDashboard: getMyDashboard,
      getPlugin: getPlugin
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
