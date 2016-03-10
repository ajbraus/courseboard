
var Course = require('../models/course.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')
  , _ = require('lodash')


module.exports = function(app) {
    // GET COURSES
    app.get('/api/courses/', function (req, res) {
      Course.find(function (err, user) {
          if (err) { return res.status(400).send({ message: err}) }
          res.send(courses);
      });
    });
}
