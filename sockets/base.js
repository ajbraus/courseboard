/*
 * SOCKETS BASE.JS
 */

var Zoink = require('../models/zoink.js')

'use strict';

module.exports = function (io) {  
  // io.set('origins', '*localhost:1337');
  
  io.on('connection', function (socket){
    console.log('user connected');


    // JOINING AND LEAVING ZOINK
    function getClientCount(roomName) {
      var room = io.sockets.adapter.rooms[roomName]; 
      if (room) {
        return Object.keys(room).length;  
      } else {
        return 0;
      }
    }
    
    // PUBLISH JOINING ROOM
    socket.on('publish.join_room', function (data) {
      console.log('user joined room', data.zoinkId);
      socket.join(data.zoinkId);

      var clientsCount = getClientCount(data.zoinkId)
      //GET ROOM USER COUNT SOCKET.IO >=1.3.5
      
      io.sockets.in(data.roomName).emit('broadcast.join_room', clientsCount)
    });

    // PUBLISH LEAVING ROOM
    socket.on('publish.leave_room', function (data) {
      console.log('user left room ', data.zoinkId);
      socket.leave(data.zoinkId);

      var clientsCount = getClientCount(data.zoinkId)

      io.sockets.in(data.roomName).emit('broadcast.leave_room', clientsCount)
    });


    // INVITES
    socket.on('publish:addInvite', function (data) {
      Zoink.findById(data.zoinkId, function(err, zoink) {
        zoink.invites.push(data.email);
        zoink.save();
        io.sockets.in(data.zoinkId).emit('addInvite', data.email)
      })
    })

    socket.on('publish:rmInvite', function (data) {
      Zoink.findById(data.zoinkId, function(err, zoink) {
        var index = zoink.invites.indexOf(data.email);
        zoink.invites.splice(index, 1);
        zoink.save();
        io.sockets.in(data.zoinkId).emit('rmInvite', data)
      })
    })

    // MESSAGES
    socket.on('publish:addMessage', function (data) {
      Zoink.findById(data.zoinkId, function(err, zoink) {
        zoink.messages.push(data);
        zoink.save();
        io.sockets.in(data.zoinkId).emit('addMessage', data)
      })
    })

    socket.on('publish:rmMessage', function (data) {
      Zoink.findById(data.zoinkId, function(err, zoink) {
        var index = zoink.messages.indexOf(data.content);
        zoink.messages.splice(index, 1);
        zoink.save();
        io.sockets.in(data.zoinkId).emit('rmMessage', data.content)
      })
    })


    // QUESTIONQUEUE

    socket.on('join.room', function (data) {
      console.log('user joined room');
      console.log(data);
      io.sockets.in(data.zoinkId).emit('broadcast.join_room', data)
    });

    socket.on('publish.comment', function (data) {
      console.log(data);
      Zoink.findById(data.post_id, function (err, post) {
        console.log(post);
        console.log(data.body)
        var comment = new Comment({ body: data.body });
        post.comments.unshift(comment);
        post.save(function (err, post) {
          if(err) { 
            console.log(err) 
            return io.sockets.in(data.zoinkId).emit('error', comment); 
          }
          return io.sockets.in(data.zoinkId).emit('broadcast.comment', post);
        })
      })
    });
    
    // PUBLISH POST
    socket.on('publish.post', function (data) {
      console.log(data);
      var post = new Zoink({
          body: data.body
        , room_name: data.room_name.toLowerCase()
      });
      console.log(post);
      post.save(function (err, post) {
        console.log('post saved')
        if (err) { 
          console.log(err);
          // io('/my-namespace')
          return io.sockets.in(data.zoinkId).emit('error', post); 
        }

        io.sockets.in(data.zoinkId).emit('broadcast.post', post);
      });
    });

    // VOTE UP
    socket.on('vote_up.post', function (data) {
      Zoink.findByIdAndUpdate(data.id, { $inc: { votes_count: 1 } } , function (err, post) {
        console.log(post)
        if (err) { 
          console.log(err);
          return io.sockets.in(data.zoinkId).emit('error', post); 
        }
        io.sockets.in(data.zoinkId).emit('broadcast.vote_up', post);
      });
    });

    socket.on('vote_down.post', function (data) {
      Zoink.findByIdAndUpdate(data.id, { $inc: { votes_count: -1 } } , function (err, post) {
        console.log(post)
        if (err) { 
          console.log(err);
          return io.sockets.in(data.zoinkId).emit('error', post); 
        }
        io.sockets.in(data.zoinkId).emit('broadcast.vote_down', post);
      });
    });

    socket.on('disconnect', function (data) {
      console.log('user disconnected');
      io.sockets.in(data.zoinkId).emit('broadcast.user_disconnected', data)
    });
  });
}