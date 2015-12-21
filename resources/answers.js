
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , config = require('../config.js')
  , auth = require('./auth.js')

module.exports = function(app) {
  // ANSWERS CREATE
  app.post('/api/questions/:questionId/answers', auth.ensureAuthenticated, function (req, res) { 
    req.body.user = req.userId;

    Question.findById(req.params.questionId).exec(function (err, question) {
      if (err) { return res.status(400).send({ message: err }) }

      req.body.question = question._id;
      Answer.create(req.body, function (err, answer) {
        if (err) { return res.status(400).send({ message: err }) }

        question.answers.push(answer);
        question.save();

        // SEND ANSWER EMAIL to FOLLOWERS AND QUESTION AUTHOR
        if (req.userId != question.user) { // IF NOT ANSWERING YOUR OWN QUESTION
          User.findById(question.user).exec(function (err, user) {
            console.log('sending email to:', user.email);
            app.mailer.send('emails/new-answer', {
              to: user.email,
              subject: req.userFullName + ' Posted a New Answer on your GA/QA Question',
              question: question,
              user: user,
              answerer: req.userFullName
            }, function (err) {
              if (err) { console.log(err); return }
            });
          })
        }

        res.send(answer);
      });
    })
  });

  // ANSWERS INDEX
  app.get('/api/questions/:questionId/answers/', auth.ensureAuthenticated, function (req, res) {
    Answer.find({ question: req.params.questionId }).populate('comments, user').exec(function (err, answers) {
      if (err) { return res.status(400).send({ message: err }) }

      res.send(answers);
    })
  });

  // ANSWERS DESTROY
  app.delete('/api/questions/:questionId/answers/:id', auth.ensureAuthenticated, function (req, res) {
    Question.findById(req.params.questionId).exec(function (err, question) {
      if (err) { return res.status(400).send({ message: err }) }

      question.comments.pull({ _id: req.params.id })
      Answer.findByIdandRemove(req.params.id, function (err) {
        if (err) { return res.status(400).send({ message: err }) }
          
        res.send("Successfully removed answer");
      })
    })
  })
}