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

}