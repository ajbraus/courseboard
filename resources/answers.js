
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , config = require('../config.js')
  , auth = require('./auth.js')

module.exports = function(app) {
  // QUESTIONS CREATE
  app.post('/api/questions/:questionId/answers', auth.ensureAuthenticated, function (req, res) { 
    req.body.user = req.userId;
    
    Question.findById(req.params.questionId).exec(function (err, question) {
      if (err) { return res.send(err) }
      Answer.create(req.body, function (err, answer) {
        if (err) { return res.send(err) }
        question.answers.push(answer);
        question.save();

        res.send(answer);
      });
    })
  });
}