
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , reputation = require('./reputation.js')
  , config = require('../config.js')
  , auth = require('./auth.js')

module.exports = function(app) {
  // ANSWERS CREATE
  app.post('/api/questions/:questionId/answers', auth.ensureAuthenticated, function (req, res) { 
    req.body.user = req.userId;

    Question.findById(req.params.questionId).exec(function (err, question) {
      if (err) { return res.status(400).send(err) }

      req.body.question = question._id;
      Answer.create(req.body, function (err, answer) {
        if (err) { return res.status(400).send(err) }

        question.answers.push(answer);
        question.save();

        // GIVE REP TO THE ANSWERER
        reputation.newValue('add', 'new-answer', req.userId);

        // SEND ANSWER EMAIL to FOLLOWERS AND QUESTION AUTHOR
        if (req.userId != question.user) { // IF NOT ANSWERING YOUR OWN QUESTION
          User.findById(question.user, '+email').exec(function (err, user) {
            console.log('sending email to:', user.email);
            app.mailer.send('emails/new-answer', {
              to: user.email,
              subject: req.userFullName + ' Posted a New Answer on your GA/QA Question',
              question: question,
              user: user,
              answerer: req.userFullName,
              answer: answer
            }, function (err) {
              if (err) { console.log(err); return }
            });
          })
        }
        Answer.populate(answer, {path:"user"}, function (err, answer) {
          res.send(answer);
        });
        
      });
    })
  });

  // ANSWERS INDEX
  app.get('/api/questions/:questionId/answers/', auth.ensureAuthenticated, function (req, res) {
    Answer.find({ question: req.params.questionId }).populate('comments, user').exec(function (err, answers) {
      if (err) { return res.status(400).send(err) }

      res.send(answers);
    })
  });

  // ANSWERS SHOW
  app.get('/api/questions/:questionId/answers/:id', auth.ensureAuthenticated, function (req, res) {
    Answer.findById(req.params.id).exec(function (err, answer) {
      if (err) { return res.status(400).send(err) }
        console.log('blah')
      res.send(answer);
    })
  });

  // ANSWERS UPDATE
  app.put('/api/questions/:questionId/answers/:id', auth.ensureAuthenticated, function (req, res) {
    Answer.findByIdAndUpdate(req.params.id, req.body, function (err, answer) {
      if (err) { return res.status(400).send(err) }

      res.send(answer);
    });
  });

  // ANSWERS DESTROY
  app.delete('/api/questions/:questionId/answers/:id', auth.ensureAuthenticated, function (req, res) {
    Question.findById(req.params.questionId).exec(function (err, question) {
      if (err) { return res.status(400).send(err) }

      question.answers.pull({ _id : req.params.id }); 
      question.save();

      Answer.findByIdAndRemove(req.params.id, function (err) {
        if (err) { return res.status(400).send(err) }

        // REMOVE REP FROM THE ANSWERER
        reputation.newValue('remove', 'new-answer', req.userId);
          
        res.send("Successfully removed answer");
      })
    })
  })
}