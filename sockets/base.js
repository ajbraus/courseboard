
var Post = require('mongoose').model('Post');

'use strict';

module.exports = function (io) {  
  io.set('origins', '*localhost:1337');
  io.on('connection', function (socket){
    console.log('a user connected');

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
}