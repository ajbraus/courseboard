/*
 * SOCKETS BASE.JS
 */

var Post = require('mongoose').model('Post');
var Comment = require('mongoose').model('Comment');

'use strict';

module.exports = function (io) {  
  // io.set('origins', '*localhost:1337');
  io.on('connection', function (socket){
    console.log('user connected');
    // var room = "some room"
    // socket.join(room, function () {
    //   console.log("joined room " + room)
    // })

    socket.on('join.room', function (data) {
      console.log('user joined room');
      console.log(data);
      io.sockets.emit('broadcast.join_room', data)
    });

    socket.on('publish.comment', function (data) {
      console.log(data);
      Post.findById(data.post_id, function (err, post) {
        console.log(post);
        console.log(data.body)
        var comment = new Comment({ body: data.body });
        post.comments.push(comment);
        post.save(function(err, post){
          if(err) { 
            console.log(err) 
            return io.sockets.emit('error', comment); 
          }
          return io.sockets.emit('broadcast.comment', post);
        })
      })
    });
    
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

    socket.on('disconnect', function (data) {
      console.log('user disconnected');
      io.sockets.emit('broadcast.user_disconnected', data)
    });
  });
}