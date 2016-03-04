var User = require('../models/user.js')
  , Course = require('../models/course.js')
  , Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')
  , _ = require('lodash')


module.exports = function(app) {
  // COURSES INDEX 
  app.get('/api/courses', function (req, res) {
    // ALL COURSES
    //                  function(err, courses)
    Course.find().exec( (error, courses) => {
      res.send(courses);
    });

    // User.findById(req.params.id, function (err, user) {
    //   res.send(user);
    // });
  });

  app.post('/api/courses', function (req, res) {
    // ALL COURSES
    //                  function(err, courses)
    Course.findOne({ title: req.body.title }, function (err, course) {
      if (course) {
        return res.status(409).send({ message: 'Course already exists' });
      }
      var course = new Course(req.body);
      course.save(function(err) {
        if (err) { return res.status(400).send(err) }

        // res.send({ token: auth.createJWT(user) });
        res.send({ message: "Course created" });
      });
    });
  });

  app.get('/api/courses/:id', function (req, res) {
    Course.findById(req.params.id, function (err, course) {
      res.send(course);
    });
  });

}