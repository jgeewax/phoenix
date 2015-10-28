# [Phoenix](http://jgeewax.github.io/phoenix)

## Getting Started

Running Phoenix locally is very simple, you'll need `npm`, `bower` and `gulp` 
installed.

Clone the repository.

```sh
$ git clone git@github.com:jgeewax/phoenix.git
```

Install all the project dependencies

```sh
$ npm install && bower install
```

Then start the server

```sh
$ gulp serve
```

And you're good to go!

## Developing a Plugin

Phoenix is still in a very early stage, so the process for creating plugins is
still very young and subject to change.

### Create repo for your plugin

**NOTE:** Currently we only support plugins hosted on public GitHub
repositories.

Your plugin name should be very specific to what it does, since we're using
Angular 1.x modules for plugins we need to avoid naming collisions. For example,
if your plugin is named `storage-browser` you should prefix any
controller/view/services with that name. (`StorageBrowserCtrl`, etc.)

You can see a list of currently available plugins
[here](https://github.com/jgeewax/phoenix/blob/master/src/plugins.json)

### Create a `package.json` file

Phoenix will parse your `package.json` in order to load your plugin files.
Your files should be specified in the `files` key.

```javascript
{
  "files": [
    "dist/storage-browser.js",
    "dist/storage-browser.css"
  ]
}
```

Currently we support html, css and js. We recommend concatenating your files
for fewer network requests.

### Create your module

Phoenix uses [System.js](https://github.com/systemjs/systemjs) under the hood to
import your plugin files, so you'll want to export your angular module.

```javascript
var mod = angular.module('my-plugin', []);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = mod;
}
```

### Create your plugin state

Phoenix uses [`ui-router`](http://angular-ui.github.io/ui-router/site/#/api/ui.router),
for routing, so when you create a plugin you'll need to register it as a child
state to `plugin`.

```javascript
angular
  .module('my-plugin')
  .config(function($stateProvider) {
    $stateProvider
      .state('my-plugin', {
        parent: 'plugin',
        controller: 'MyPluginCtrl',
        controllerAs: 'plugin'
        templateUrl: 'my-plugin.html',
        resolve: { getMyThing: function() {/* ... */} }
      });
  });
```

**NOTE:** Do not add a `url` to your state. Because a plugin can be installed
multiple times and the friendly name can be altered, Phoenix will take care of
creating a url for you. The default url will be the name of your plugin
(e.g. `storage-browser` => `/storage-browser`)

### Making your plugin discoverable

Currently we curate plugins, in order to make your plugin available you'll need
to fork the Phoenix project and add your plugin to the
[`plugins.json` file](https://github.com/jgeewax/phoenix/blob/master/src/plugins.json)

### Theming your plugin

Phoenix is themed using [Google's Material Design](https://www.google.com/design/spec/material-design/introduction.html)
via [`angular-material`](https://material.angularjs.org/latest/), so when
possible any directives, services, classes, etc. from there should be leveraged
instead of writing custom styles/directives.

Material Design icons are also available via web font and can be used with the
`md-icon` directive.

```html
<md-icon>filter_list</md-icon>
```

### Testing your plugin

This area still needs a lot of work, but there are currently two ways to test
your plugin.

1. Run a local instance of Phoenix and add your plugin to the `plugins.json`
file, if you want to avoid pushing to your repo constantly, you can use a proxy
service to inject your local files.
2. Create an index.html file in the root of your project that stubs out the
Phoenix specific services you need and install all client side dependencies as
`devDependencies`. An example of this can be seen on the
[storage browser](https://github.com/callmehiphop/storage-browser/blob/master/index.html)
plugin

### Project and plugin data

If you need metadata about the current project, there is an object you can
inject into your controller (it's created via resolve, so you can not inject it
into services) called `$project`. Most cases you'll only need to know the
project id which you can access like so..

```javascript
angular
  .module('my-plugin')
  .controller('MyPluginCtrl', function($project) {
    console.log($project.id);
  });
```

If your plugin allows for a lot of customization, there is a similar object
specifically for the active plugin instance.

```javascript
angular
  .module('my-plugin')
  .controller('MyPluginCtrl', function($plugin) {
    console.log($plugin.name);
  });
```

### Communicating with Google APIs

For the time being we're using
[angular-google-gapi](https://github.com/maximepvrt/angular-google-gapi), so to
interact with the various Google APIs, you can inject the `GApi` service into
your controller/service/etc.

```javascript
angular
  .module('my-plugin')
  .controller('MyPluginCtrl', function($project, GApi) {
    var vm = this;

    vm.listBuckets = listBuckets;

    function listBuckets() {
      return GApi.executeAuth('storage', 'buckets.list', {
        project: $project.id
      });
    }
  });
```

### 3rd party libraries

Phoenix ships with jQuery and lodash by default, so please do not include
those in your project. If you wish to include a different library (THREE.js,
d3.js, etc.), you can do so by using `System.js`. We use jspm to load libraries,
so you can import them from either a Github repo or npm.

```javascript
angular
  .module('my-plugin')
  .config(function($stateProvider) {
    $stateProvider
      .state('my-plugin', {
        resolve: {
          d3: function(System) {
            return System.import('npm:d3@3.5.6/d3.js')
          }
        }
      })
  });
```
