/*
 * Post Resource
 */

var Post = require('mongoose').model('Post');

module.exports = function(app, io) {
  // INDEX
  app.get('/api/posts', function (req, res) {
    Post.find().sort('-created_at').exec(function(err, posts) {
      if (err) { return res.status(404).send(err) };
      res.status(200).json(posts); // return all nerds in JSON format
    });
  });

  //CREATE
  app.post('/api/posts', function (req, res) {
    var post = new Post({
      body: req.body.body
    });
    console.log(post);
    post.save(function (err, post) {
      console.log('post saved')
      if (err) { return res.send(err) };
      io.sockets.emit('post.published', post);
      res.json(201);
    });
  });

  app.put('/api/vote_up/posts/:id', function (req, res) {
    console.log('voting up')
    Post.findByIdAndUpdate(req.params.id, { $inc: { votes_count: 1 } } , function (err, post) {
      if (err) { return res.send(err) }
        console.log(post)
      res.status(201)
      io.sockets.emit('post.voted_up', post);
    });
  });

  app.put('/api/vote_down/posts/:id', function (req, res) {
    console.log('voting down')
    Post.findByIdAndUpdate(req.params.id, { $inc: { votes_count: -1 } } , function (err, post) {
      if (err) { return res.send(err) }
      res.status(201);
      io.sockets.emit('post.voted_down', post);
    });
  });

  // SHOW
  app.get('/api/posts/:id', function (req, res) {
    Post.findById(req.params.id, function(err, post) {
      console.log('blah')
      if (err) { return res.status(404).send(err) };
      res.status(200).json(post); 
    });
  });

  // UPDATE
  app.put('/api/posts/:id', function (req, res) {
    Post.findOneAndUpdate({ _id: req.params.id}, req.query.post, function (err, post) {
      if (err) { return res.send(err) }
      res.status(200).json(post)
    });
  });

  // DESTROY
  app.delete('/api/posts/:id', function (req, res) { 
    Post.findByIdAndRemove(req.params.id, function (err, post) {
      if (err) { return res.send(err) }
      res.status(200);
    });
  });
}