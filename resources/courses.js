
var Course = require('../models/course.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , qs = require('querystring')
  , jwt = require('jwt-simple')
  , request = require('request')
  , config = require('../config.js')
  , moment = require('moment')
  , auth = require('./auth')

module.exports = function(app) {
  app.get('/api/courses', function(req, res) {
    Course.find().exec(function (err, courses) {
      if (err) { return res.status(400).send(err)  }

      res.send(courses);
    });
  });

  app.post('/api/courses', function(req, res) {
    Course.create(req.body, function (err, course) {
      if (err) { return res.status(400).send(err)  }

      res.send(course);
    })
  });
}