/*
 * Post Resource
 */

var Post = require('mongoose').model('Post');

module.exports = function(app) {
  // INDEX
  app.get('/api/room/:room_name/posts', function (req, res) {
    if (req.params.room_name[0] === "#") {
      req.params.room_name = req.params.room_name.substring(1);
    }
    req.params.room_name = req.params.room_name.toLowerCase();

    Post.find(req.params).sort('-created_at').exec(function(err, posts) {
      if (err) { return res.status(404).send(err) };
      res.status(200).json(posts); // return all nerds in JSON format
    });
  });

  //CREATE
  // app.post('/api/posts', function (req, res) {
  //   var post = new Post({
  //       body: req.body.body
  //     , room_name: req.body.roomName
  //   });
  //   console.log(post);
  //   post.save(function (err, post) {
  //     console.log('post saved')
  //     if (err) { return res.send(err) };
  //     res.status(201); 
  //     io.sockets.emit('post.published', post);
  //   });
  // });

  // // SHOW
  // app.get('/api/posts/:id', function (req, res) {
  //   Post.findById(req.params.id, function(err, post) {
  //     console.log('blah')
  //     if (err) { return res.status(404).send(err) };
  //     res.status(200).json(post); 
  //   });
  // });

  // // UPDATE
  // app.put('/api/posts/:id', function (req, res) {
  //   Post.findOneAndUpdate({ _id: req.params.id}, req.query.post, function (err, post) {
  //     if (err) { return res.send(err) }
  //     res.status(200).json(post)
  //   });
  // });

  // // DESTROY
  // app.delete('/api/posts/:id', function (req, res) { 
  //   Post.findByIdAndRemove(req.params.id, function (err, post) {
  //     if (err) { return res.send(err) }
  //     res.status(200);
  //   });
  // });
}