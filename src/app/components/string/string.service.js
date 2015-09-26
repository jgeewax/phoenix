(function() {
  'use strict';

  angular
    .module('gcloudConsole')
    .factory('string', string);

  function string() {
    function dash(str) {
      return str
        .replace(/([A-Z])/g, '-$1')
        .replace(/[-_\s]+/g, '-');
    }

    function underscore(str) {
      return str
        .replace(/([a-z\d])([A-Z]+)/g, '$1_$2')
        .replace(/[-\s]+/g, '_');
    }

    function human(str) {
      return underscore(str)
        .replace(/_id$/, '')
        .replace(/_/g, ' ');
    }

    function slug(str) {
      str = str
        .replace(/[^\w\s-]/g, '-')
        .toLowerCase();

      return dash(str);
    }

    function title(str) {
      return human(str)
        .toLowerCase()
        .replace(/(?:^|\s|-)\S/g, function(c) {
          return c.toUpperCase();
        });
    }

    return {
      slug: slug,
      title: title
    };
  }
}());
