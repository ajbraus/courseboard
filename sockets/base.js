/*
 * SOCKETS BASE.JS
 */

var Zoink = require('../models/zoink.js')
var config = require('../config') 

'use strict';

module.exports = function (io, app) {  
  // io.set('forigins', '*localhost:1337');
  
  io.on('connection', function (socket){
    // console.log('user connected');
    
    // JOINING AND LEAVING ZOINK
    
    function getClientCount(roomName) {
      //GET ROOM USER COUNT SOCKET.IO >=1.3.5
      var room = io.sockets.adapter.rooms[roomName]; 
      if (room) {
        return Object.keys(room).length;  
      } else {
        return 0;
      }
    }
    
    // PUBLISH JOINING ROOM
    socket.on('publish:joinRoom', function (data) {
      // console.log('user joined room', data._id);
      socket.join(data._id);

      var clientsCount = getClientCount(data._id)
      
      io.sockets.in(data._id).emit('joinRoom', clientsCount)
    });

    // PUBLISH LEAVING ROOM
    socket.on('publish:leaveRoom', function (data) {
      console.log('user left room ', data._id);
      socket.leave(data._id);

      var clientsCount = getClientCount(data._id)

      io.sockets.in(data._id).emit('leaveRoom', clientsCount)
    });


    // INVITES
    socket.on('publish:addInvite', function (data) {
      Zoink.findById(data.zoinkId, function(err, zoink) {
        zoink.invites.push(data.email);
        zoink.save(function(err) {
          
          // SEND INVITE EMAIL
          app.mailer.send('emails/new-invite', {
            to: data.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
            subject: 'Zoinks! A New Invite', // REQUIRED. 
            zoink: zoink  // All additional properties are also passed to the template as local variables. 
          }, function (err) {
            if (err) { console.log(err); return }
          });

          io.sockets.in(data.zoinkId).emit('addInvite', data.email)
        });
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

    // RSVPS
    socket.on('publish:addRsvp', function (data) {
      console.log(data)
      Zoink.findById(data.zoinkId, function(err, zoink) {
        zoink.rsvps.push(data.user._id);

        var index = data.user.email.indexOf(zoink.invites)
        zoink.invites.splice(index, 1)

        zoink.save();

        // TODO email host

        io.sockets.in(data.zoinkId).emit('addRsvp', data.user)
      })
    })

    socket.on('publish:rmRsvp', function (data) {
      Zoink.findById(data.zoinkId, function(err, zoink) {
        var index = data.user._id.indexOf(zoink.rsvps);
        zoink.rsvps.splice(index, 1);

        zoink.invites.push(data.user.email);

        zoink.save();

        // TODO email host

        io.sockets.in(data.zoinkId).emit('rmRsvp', data.user)
      })
    })

    // REQS
    socket.on('publish:addReq', function (data) {
      console.log(data);
      Zoink.findById(data.zoinkId, function(err, zoink) {
        zoink.reqs.push(data.reqs);
        console.log(zoink);

        zoink.save();

        io.sockets.in(data.zoinkId).emit('addReq', data);
      });
    });

    socket.on('publish:rmReq', function (data) {
      Zoink.findById(data.zoinkId, function(err, zoink) {
        var index = data.user._id.indexOf(zoink.reqs);
        zoink.reqs.splice(index, 1);

        // zoink.invites.push(data.user.email);

        zoink.save();

        // TODO email host

        io.sockets.in(data.zoinkId).emit('rmReq', data.user);
      });
    });


    // QUESTIONQUEUE

    socket.on('join.room', function (data) {
      console.log('user joined room');
      console.log(data);
      io.sockets.in(data.zoinkId).emit('broadcast.join_room', data)
    });

    socket.on('publish:comment', function (data) {
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
    socket.on('publish:post', function (data) {
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
      // console.log('user disconnected');
      io.sockets.in(data.zoinkId).emit('broadcast.user_disconnected', data)
    });
  });
}