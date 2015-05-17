/*
 * SOCKETS BASE.JS
 */

var Post = require('mongoose').model('Post');

'use strict';

module.exports = function (io) {  
  // io.set('origins', '*localhost:1337');
  io.on('connection', function (socket){
    console.log('A USER CONNECTED TO THE SOCKET');
    // var room = "some room"
    // socket.join(room, function () {
    //   console.log("joined room " + room)
    // })
    // PUBLISH POST
    socket.on('publish.post', function (data) {
      console.log(data);
      var post = new Post({
          body: data.body
        , room_name: data.room_name.toLowerCase()
      });
      console.log(post);
      post.save(function (err, post) {
        console.log('post saved')
        if (err) { 
          console.log(err);
          // io('/my-namespace')
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