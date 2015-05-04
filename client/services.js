/*
 * SERVICES
 */

'use strict';

angular.module('myApp.services', [])
  .factory('Post', function ($resource, HOST) {
    return $resource(HOST + '/api/posts/:id', { id: '@id' }, {
      vote_up: { url: HOST + '/api/vote_up/posts/:id', method: 'PUT', isArray: false },
      vote_down: { url: HOST + '/api/vote_down/posts/:id', method: 'PUT', isArray: false }
    })
  })

  .factory('Socket', ['socketFactory', function (socketFactory) {
    return socketFactory({
      prefix: '',
      ioSocket: io.connect('http://localhost:1337')
    });
  }]);
