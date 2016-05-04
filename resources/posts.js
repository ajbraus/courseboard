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
  app.get('/api/users/:id/posts', auth.ensureAuthenticated, function (req, res) {
    Course.find({ students: req.params.id }).select('_id').exec(function(err, courses) {
      if (!courses) { return res.status(400).send(err) }

      Post.find({ 'course': { $in: _.pluck(courses, '_id') }})
          .sort({ createdAt: -1 })
          .populate({ path: 'course', select: 'title' })
          .populate({ path: 'user', select: 'username' })
          .exec(function(err, posts) {

        if (!posts) { return res.status(400).send(err) }

        res.send(posts);
      });
    });
  });

  // INDEX OF POSTS FROM A SINGLE COURES
  app.get('/api/courses/:courseId/posts', auth.ensureAuthenticated, function (req, res) {
    Post.find({ course: req.params.courseId })
        .populate({ path: 'user', select: 'username' })
        .sort({ createdAt: -1 }).exec(function(err, posts) {
      if (!posts) { return res.status(400).send(err) }

      res.send(posts)
    })
  })

  // INDEX OF POSTS USER MADE
  // app.get('/api/posts', auth.ensureAuthenticated, function (req, res) {
  //   Post.find({ user: req.userId }).exec(function(err, posts) {

  //     res.send(posts);
  //   });
  // });

  // CREATE
  app.post('/api/courses/:courseId/posts', auth.ensureAuthenticated, function (req, res) {
    // Find the course
    Course.findById(req.params.courseId).populate('students').exec(function(err, course) {
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

        // if emailParticipants send emails
        if (post.emailParticipants) {
          for (i = 0; i < course.students.length; i++) { 
            app.mailer.send('emails/announcement', {
              to: course.students[i].email,
              course: course,
              subject: 'Announcement - ' + course.title,
              post: post,
              user: course.students[i]
            }, function (err) {
              if (err) { console.log(err); return }
            });
          }
        }

        // send back post
        User.findById(req.userId).exec(function(err, user) {
          post.user = user;
          res.send(post);  
        })
        
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
  app.delete('/api/courses/:courseId/posts/:id', auth.ensureAuthenticated, function (req, res) {
    Post.findById(req.params.id).exec(function (err, post) {
      if (err) { return res.status(400).send(err) }

      // Course.findById(req.params.courseId).exec(function (err, course) {
      //   course.update({})
      // })

      Course.update({ _id: req.params.courseId }, { $pull: { posts: post._id } }, function(err, course) {
        if (err) { return res.status(400).send(err) }

        post.remove();
        res.send("Successfully removed post");
      });
    });
  });
}
