!function(){"use strict";angular.module("gcloudConsole",["ngAnimate","ngSanitize","ui.router","ngMaterial","angular-google-gapi","oc.lazyLoad"])}(),function(){"use strict";function t(t,e,n){function o(){n.executeAuth("storage","buckets.list",{project:e.projectId}).then(function(t){c.buckets=t.items})}function r(e){t.show({parent:angular.element(document.body),targetEvent:e,templateUrl:"app/components/storage-browser/storage-browser-dialog.html",controller:l,controllerAs:"bucket",bindToController:!0})}function l(){function o(){n.executeAuth("storage","buckets.insert",{project:e.projectId,name:l.name}).then(function(t){c.buckets.push(t)}).then(r)}function r(){t.hide()}var l=this;l.create=o,l.cancel=r,l.storageClass=!1,l.location="US"}var c=this;c.refresh=o,c.createBucket=r,n.load("storage","v1"),o()}var e=angular.module("gcloudConsole").controller("StorageBrowserCtrl",t);t.$inject=["$mdDialog","$stateParams","GApi"],"undefined"!=typeof module&&(module.exports=e)}(),function(){"use strict";function t(t,e,n){function o(t,e){return angular.extend({},t,{headers:{Authorization:"Bearer "+e.access_token},url:a+t.url,method:t.method||"GET",cache:i})}function r(e){return n.setScope(c),n.getToken().then(function(n){var r=o(e,n);return t(r)})}function l(){return r({url:"/projects"}).then(function(t){return t.data.projects})}var c="https://www.googleapis.com/auth/cloud-platform",a="https://cloudresourcemanager.googleapis.com/v1beta1",i=e("resource");return{getProjectList:l}}angular.module("gcloudConsole").factory("resource",t),t.$inject=["$http","$cacheFactory","GAuth"]}(),function(){"use strict";function t(){return{restrict:"E",replace:!0,scope:{projects:"=",user:"="},templateUrl:"app/components/navbar/navbar.html",controller:e,controllerAs:"navbar",bindToController:!0}}function e(t,e,n){function o(){return t.params.projectId}function r(t){i.selectedProject=l(t)||a}function l(t){for(var e=0;e<u.length;e++)if(u[e].projectId===t)return u[e].name}function c(){return n.logout().then(function(){t.go("login")})}var a="Select a project",i=this,u=i.projects;i.selectedProject=a,i.logout=c,e.$watch(o,r)}angular.module("gcloudConsole").directive("navbar",t),e.$inject=["$state","$scope","GAuth"]}(),function(){"use strict";function t(t){t.state("projects",{url:"/projects",templateUrl:"app/projects/projects.html",controller:"ProjectsCtrl",controllerAs:"projects",resolve:{projectList:e}})}function e(t){return t.getProjectList()}angular.module("gcloudConsole").config(t),t.$inject=["$stateProvider"],e.$inject=["resource"]}(),function(){"use strict";function t(t){var e=this;e.list=t}angular.module("gcloudConsole").controller("ProjectsCtrl",t),t.$inject=["projectList"]}(),function(){"use strict";function t(t){t.state("project",{parent:"projects",url:"/:projectId",templateUrl:"app/project/project.html",resolve:{project:e}})}function e(t,e){for(var n=t.projectId,o=0;o<e.length;o++)if(e[o].projectId===n)return e[o];throw new Error('Unknown project id "'+n+'"')}angular.module("gcloudConsole").config(t),t.$inject=["$stateProvider"],e.$inject=["$stateParams","projectList"]}(),function(){"use strict";function t(t,e,n){function o(t){return angular.isArray(t)?t:[t]}function r(r){var l=o(r).map(function(t){return n["import"](t)});return t.all(l).then(function(t){return e.inject(t).then(function(){return t})})}return{load:r}}angular.module("gcloudConsole").factory("$gcPlugin",t),t.$inject=["$q","$ocLazyLoad","System"]}(),function(){"use strict";function t(t){t.state("plugin",{parent:"project",url:"/:pluginId",templateUrl:"app/plugin/plugin.html",controller:"PluginCtrl",controllerAs:"plugin",resolve:{plugin:e}})}function e(t){return t.load(["app/components/storage-browser/storage-browser.controller.js"]).then(function(){return{controller:"StorageBrowserCtrl",templateUrl:"app/components/storage-browser/storage-browser.html"}})}angular.module("gcloudConsole").config(t),t.$inject=["$stateProvider"],e.$inject=["$gcPlugin"]}(),function(){"use strict";function t(t,e){var n=e("{{controller}} as plugin"),o=e('"{{view}}"');return{restrict:"A",scope:{controller:"=pluginController",view:"=pluginView"},link:function(e,r){r.attr("ng-controller",n(e)),r.removeAttr("plugin-controller"),r.attr("ng-include",o(e)),r.removeAttr("plugin-view"),t(r)(e)}}}angular.module("gcloudConsole").directive("pluginController",t),t.$inject=["$compile","$interpolate"]}(),function(){"use strict";function t(t){angular.extend(this,t)}angular.module("gcloudConsole").controller("PluginCtrl",t),t.$inject=["plugin"]}(),function(){"use strict";function t(t){t.state("login",{controller:"LoginCtrl",controllerAs:"mv",url:"/login",templateUrl:"app/login/login.html"})}angular.module("gcloudConsole").config(t),t.$inject=["$stateProvider"]}(),function(){"use strict";function t(t,e){function n(){return e.login().then(function(){t.go("projects")})}var o=this;o.login=n}angular.module("gcloudConsole").controller("LoginCtrl",t),t.$inject=["$state","GAuth"]}(),function(){"use strict";function t(t,e,n,o,r,l){o.setClient(l),t.$on("$stateChangeError",function(){console.log(arguments)}),t.$on("$locationChangeSuccess",function(t){r.isLogin()||(t.preventDefault(),o.checkAuth().then(function(){e.sync()},function(){n.get("$state").go("login")}))}),e.listen()}angular.module("gcloudConsole").run(t),t.$inject=["$rootScope","$urlRouter","$injector","GAuth","GData","CLIENT_ID"]}(),function(){"use strict";function t(t){t.deferIntercept(),t.otherwise(function(t){var e=t.get("GData");return e.isLogin()?"/projects":"/login"})}angular.module("gcloudConsole").config(t),t.$inject=["$urlRouterProvider"]}(),function(){"use strict";angular.module("gcloudConsole").constant("System",System).constant("CLIENT_ID","288560394597-82lbmhf7077sl5bfp1ll4nnjbhi27etn.apps.googleusercontent.com")}(),function(){"use strict";function t(t,e){var n=t.extendPalette("grey",{0:"#9e9e9e",500:"#fafafa"});t.definePalette("consolePalette",n),t.theme("default").primaryPalette("consolePalette").accentPalette("blue"),e.config({paths:{"github:*":"https://github.jspm.io/*.js","npm:*":"https://npm.jspm.io/*.js"}})}angular.module("gcloudConsole").config(t),t.$inject=["$mdThemingProvider","System"]}(),angular.module("gcloudConsole").run(["$templateCache",function(t){t.put("app/login/login.html",'<div flex="" layout="column" layout-align="center center" layout-margin="" class="layout"><div class="login-logo"><img src="assets/images/logo-vertical.svg" alt="Google Developers Console"></div><md-button class="md-raised md-accent" ng-click="mv.login()">Login</md-button></div>'),t.put("app/plugin/plugin.html",'<div flex="" layout="column" plugin-controller="plugin.controller" plugin-view="plugin.templateUrl"></div>'),t.put("app/project/project.html",'<md-sidenav flex="" md-is-locked-open="true" class="md-sidenav-left md-whiteframe-z1 project-nav"><ul class="project-nav-list"><li class="project-nav-list-header"><md-icon>extension</md-icon><span>Plugins</span></li><li><a ui-sref="plugin({ pluginId: \'bucket-explorer\' })" class="project-nav-link">Bucket Explorer</a></li></ul></md-sidenav><div layout="column" flex="" ui-view=""></div>'),t.put("app/projects/projects.html",'<section layout="column" flex=""><navbar projects="projects.list" user="gapi.user"></navbar><div ui-view="" layout="row" layout-margin="" flex=""></div></section>'),t.put("app/components/navbar/navbar.html",'<md-toolbar layout="row" layout-align="start center" class="md-whiteframe-z1 navbar"><a ui-sref="projects" title="Developer Console Projects"><img class="navbar-logo" src="assets/images/logo-color.svg" alt="gcloud"></a><md-menu layout="column" class="navbar-project-selector"><md-button ng-click="$mdOpenMenu($event)">{{navbar.selectedProject}}<md-icon class="material-icons">arrow_drop_down</md-icon></md-button><md-menu-content width="3"><md-menu-item ng-repeat="option in navbar.projects"><md-button ui-sref="project({ projectId: option.projectId })" class="navbar-project-link">{{option.name}}</md-button></md-menu-item></md-menu-content></md-menu><span flex=""></span><md-button class="md-icon-button"><md-tooltip>Settings</md-tooltip><md-icon>settings</md-icon></md-button><md-menu layout="column"><md-button class="md-icon-button" ng-click="$mdOpenMenu($event)" aria-label="Open user actions menu"><img class="navbar-user-icon" ng-src="{{navbar.user.picture}}"></md-button><md-menu-content><md-menu-item><md-button ng-click="navbar.logout()">Sign out</md-button></md-menu-item></md-menu-content></md-menu></md-toolbar>'),t.put("app/components/storage-browser/storage-browser-dialog.html",'<md-dialog aria-label="Bucket dialog" flex="33"><md-dialog-content><h2>Create Bucket</h2><md-input-container><label>Name</label> <input type="text" ng-model="bucket.name" required=""></md-input-container><md-input-container><label>Storage class</label><md-select ng-model="bucket.storageClass"><md-option value="false">Standard</md-option><md-option value="DURABLE_REDUCED_AVAILABILITY">Durable Reduced Availability</md-option><md-option value="NEARLINE">Nearline</md-option></md-select></md-input-container><md-input-container><label>Location</label><md-select ng-model="bucket.location"><md-option value="US">United States</md-option><md-option value="ASIA">Asia</md-option><md-option value="EU">European Union</md-option></md-select></md-input-container></md-dialog-content><div class="md-actions"><md-button class="md-raised md-accent" ng-click="bucket.create()">Create</md-button><md-button ng-click="bucket.cancel()">Cancel</md-button></div></md-dialog>'),t.put("app/components/storage-browser/storage-browser.html",'<md-content flex="" layout-padding="" class="md-whiteframe-z1"><md-subheader><md-button class="md-raised md-accent" ng-click="plugin.createBucket()">Create bucket</md-button><md-button class="md-icon-button" aria-lable="Refresh" ng-click="plugin.refresh()"><md-tooltip>Refresh</md-tooltip><md-icon>refresh</md-icon></md-button><span flex=""></span><md-input-container md-no-float="" class="storage-browser-filter"><input type="text" placeholder="Filter" ng-model="plugin.filter"></md-input-container></md-subheader><table class="storage-browser-table"><thead><tr><th class="lefty">Name</th><th class="lefty">Storage class</th><th class="lefty">Location</th></tr></thead><tbody><tr ng-repeat="bucket in plugin.buckets | filter:{name: plugin.filter}"><td class="lefty">{{bucket.name}}</td><td class="lefty">{{bucket.storageClass}}</td><td class="lefty">{{bucket.location}}</td></tr></tbody></table></md-content>')}]);