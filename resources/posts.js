var User = require('../models/user.js')
  , Post = require('../models/post.js')
  , Course = require('../models/course.js')
  , Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')
  , _ = require('lodash')


module.exports = function(app) {
  // INDEX OF POSTS FROM ENROLLED COURSES 
  app.get('/api/posts', auth.ensureAuthenticated, function (req, res) {
    Course.find({ students: req.userId }).select('_id').exec(function(err, courses) {
      Post.find({ course: courses }).exec(function(err, posts) {
        res.send(posts);
      })
    });
  });

  // INDEX OF POSTS USER MADE
  app.get('/api/posts', auth.ensureAuthenticated, function (req, res) {
    Post.find({ user: req.userId }).exec(function(err, posts) {

      res.send(posts);
    });
  });

  // CREATE
  app.post('/api/courses/:course_id/posts', auth.ensureAuthenticated, function (req, res) {
    var post = new Post(req.body);
    post.user = req.userId
    post.course = req.params.course_id
    post.save(function(err, post) {
      if (err) { return res.status(400).send(err) }

      res.send(post);
    });

  });

  // // SHOW
  // app.get('/api/posts/:id', function (req, res) {
  //   Post.findById(req.params.id).populate('user').exec(function (err, post) {
  //     if (err) { return res.status(400).send(err) }

  //     res.send(post);
  //   });
  // });

  // UPDATE
  app.put('/api/posts/:id', auth.ensureAuthenticated, function (req, res) {
    Post.findByIdAndUpdate(req.body._id, req.body, function (err, post) {
      if (!post) { return res.status(400).send({message: 'Post not found' }) }

      res.status(200).send(post);
    });
  });

  // DELETE
  app.delete('/api/posts/:id', auth.ensureAuthenticated, function (req, res) {
    Post.findById(req.params.id).exec(function (err, post) {
      if (err) { return res.status(400).send(err) }

      postId = post._id;
      post.remove();

      res.send("Successfully removed post: " + postId);
    })
  });
}
