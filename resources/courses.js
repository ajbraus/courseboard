var User = require('../models/user.js')
  , Course = require('../models/course.js')
  , Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')
  , _ = require('lodash')


module.exports = function(app) {
  // INDEX
  app.get('/api/courses', function (req, res) {
    Course.find().exec( (error, courses) => {

      res.send(courses);
    });
  });

  // CREATE
  app.post('/api/courses', auth.ensureAuthenticated, function (req, res) {
    var course = new Course(req.body);
    course.user = req.userId
    course.save(function(err, course) {
      if (err) { return res.status(400).send(err) }

      res.send(course);
    });

  });

  // SHOW
  app.get('/api/courses/:id', function (req, res) {
    Course.findById(req.params.id).populate('user').exec(function (err, course) {
      if (err) { return res.status(400).send(err) }

      res.send(course);
    });
  });

  // UPDATE
  app.put('/api/courses/:id', auth.ensureAuthenticated, function (req, res) {
    Course.findByIdAndUpdate(req.body._id, req.body, function (err, course) {
      if (!course) { return res.status(400).send({message: 'Course not found' }) }

      res.status(200).send(course);
    });
  });

  // DELETE
  app.delete('/api/courses/:id', auth.ensureAuthenticated, function (req, res) {
    Course.findById(req.params.id).exec(function (err, course) {
      if (err) { return res.status(400).send(err) }

      courseId = course._id;
      course.remove();

      res.send("Successfully removed course: " + courseId);
    })
  });
}
