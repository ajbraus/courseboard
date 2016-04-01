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
  app.post('/api/courses/:courseId/posts', auth.ensureAuthenticated, function (req, res) {
    // Find the course
    Course.findById(req.params.courseId).exec(function(err, course) {
      // Make the post object with the model
      var post = new Post(req.body);
      // assign the user of the post
      post.user = req.userId
      // assign the course to the post
      post.course = req.params.courseId
      //save the post
      post.save(function(err, post) {
        // catch error
        if (err) { return res.status(400).send(err) }
        // unshift post into course.posts
        course.posts.unshift(post)
        // save the course
        course.save();

        // send back post
        res.send(post);
      });      
    })


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
