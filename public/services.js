/*
 * SERVICES
 */

'use strict';

angular.module('myApp.services', [])
  .factory('Post', function ($resource, HOST) {
    return $resource(HOST + '/api/room/:room_name/posts/:id', {  room_name: '@room_name', id: '@id' })
  })

  .factory('Socket', ['socketFactory', function (socketFactory) {
    var socket = socketFactory();
    // {
        // ioSocket: io.connect('http://localhost:1337/')
      // , prefix: ''
    // }
    socket.forward('broadcast.join_room')
    socket.forward('broadcast.post');
    socket.forward('broadcast.comment');
    socket.forward('broadcast.vote_up');
    socket.forward('broadcast.vote_down');
    return socket
  }]);
