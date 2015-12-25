
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , reputation = require('./reputation.js')
  , auth = require('./auth.js')
  , config = require('../config.js')

module.exports = function(app) {
  // VOTE QUESTION UP
  app.post('/api/questions/:questionId/vote-up', auth.ensureAuthenticated, function (req, res) {
    Question.findById(req.params.questionId).exec(function (err, question) {
      question.votes.push(req.userId);
      question.save();

      reputation.newValue('add', 'new-question-vote', question.user);

      res.send({ message: "Question Voted Up" })
    })
  });

  // VOTE ANSWER UP
  app.post('/api/answers/:answerId/vote-up', auth.ensureAuthenticated, function (req, res) {
    Answer.findById(req.params.answerId).exec(function (err, answer) {
      answer.votes.push(req.userId);
      answer.save();

      reputation.newValue('add', 'new-answer-vote', answer.user);

      res.send({ message: "Answer Voted Up" })
    })
  });

  // VOTE QUESTION DOWN
  // app.post('/api/questions/:questionId/vote-down', auth.ensureAuthenticated, function (req, res) {
  //   Question.findById(req.params.questionId).exec(function (err, question) {
  //     question.votes.pull(req.userId);
  //     question.save();

  //     reputation.newValue('remove', 'new-vote', question.user);

  //     res.send({ message: "Voted Down" })
  //   })
  // })
}