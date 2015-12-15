
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , config = require('../config.js')

module.exports = function(app) {
  // , auth.ensureAuthenticated,
  app.get('/api/questions', function(req, res) {
    Question.find().exec(function(questions) {
      res.send(questions)
    })
  })
}