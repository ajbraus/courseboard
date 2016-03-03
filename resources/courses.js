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

    app.get('/api/courses/', function (req, res) {
      Course.find().exec(function (err, courses) {
        res.send(
            [
                { title: 'Data Structures', instructor: 'Alan Davis', description: 'write badass data structures algorithms while I try to trick you with syntax errors', duration: '10 weeks' },
                { title: 'iOS', instructor: 'Benji Encz', description: 'make cool iOS apps', duration: '12 weeks' },
                { title: 'Ruby on Rails', instructor: 'Andy Tiffany', description: 'make cool web apps', duration: '8 weeks' }
            ]
        );
      });
  })};
