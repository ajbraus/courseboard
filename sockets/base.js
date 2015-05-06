/*
 * SOCKETS BASE.JS
 */

var Post = require('mongoose').model('Post');

'use strict';

module.exports = function (io) {  
  // io.set('origins', '*localhost:1337');
  io.on('connection', function (socket){
    console.log('a user connected so I rock');

    // PUBLISH POST
    socket.on('publish.post', function (data) {
      console.log(data);
      var post = new Post({
          body: data.body
        , room_name: data.roomName
      });
      console.log(post);
      post.save(function (err, post) {
        console.log('post saved')
        if (err) { 
          console.log(err);
          return io.sockets.emit('error', post); 
        }
        io.sockets.emit('broadcast.post', post);
      });
    });

    // VOTE UP
    socket.on('vote_up.post', function (data) {
      Post.findByIdAndUpdate(data.id, { $inc: { votes_count: 1 } } , function (err, post) {
        console.log(post)
        if (err) { 
          console.log(err);
          return io.sockets.emit('error', post); 
        }
        io.sockets.emit('broadcast.vote_up', post);
      });
    });

    socket.on('vote_down.post', function (data) {
      Post.findByIdAndUpdate(data.id, { $inc: { votes_count: -1 } } , function (err, post) {
        console.log(post)
        if (err) { 
          console.log(err);
          return io.sockets.emit('error', post); 
        }
        io.sockets.emit('broadcast.vote_down', post);
      });
    });

    socket.on('disconnect', function(){
      console.log('user disconnected');
    });
  });
}