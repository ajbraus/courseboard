
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , reputation = require('./reputation.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')


module.exports = function(app) {
  // QUESTIONS INDEX 
  app.get('/api/questions', auth.ensureAuthenticated, function (req, res) {
    // RECENT QUESTIONS
    Question.paginate({}, { sort:'-createdAt', page: req.query.pages, populate: 'user' }).then(function (result) {
      // if (err) { return res.status(400).send({ message: err }) }
      res.send(result);
    });
  });

  app.get('/api/gif', function (req, res) {
    request('http://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC', function (err, response, body) {
      var url = JSON.parse(body).data.fixed_width_downsampled_url
      res.send(url);
    })
  })

  // QUESTIONS SHOW
  app.get('/api/questions/:id', auth.ensureAuthenticated, function (req, res) {
    Question.findById(req.params.id).populate('comments, user').exec(function (err, question) {
      if (err) { return res.status(400).send({ message: err }) }

      question.impressions = question.impressions + 1;
      question.save();

      res.send(question);
    });
  });

  // QUESTIONS CREATE
  app.post('/api/questions', auth.ensureAuthenticated, function (req, res) { 
    req.body.user = req.userId;
    req.body.votes = [req.userId]; // already vote for own answer

    Question.create(req.body, function (err, question) {
      if (err) { return res.status(400).send({ message: err }) }

      // GIVE REP TO THE QUESTIONER
      reputation.newValue('add', 'new-question', req.userId);

      res.send(question);
    });
  });

  // QUESTIONS UPDATE
  app.put('/api/questions/:id', auth.ensureAuthenticated, function (req, res) { 
    req.body.user = req.userId;

    Question.findByIdAndUpdate(req.params.id, req.body, function (err, question) {
      if (err) { return res.status(400).send({ message: err }) }

      res.send(question);
    });
  });

  // QUESTIONS DELETE
  app.delete('/api/questions/:id', auth.ensureAuthenticated, function (req, res) {
    Question.findByIdAndRemove(req.params.id).exec(function (err) {
      if (err) { return res.status(400).send({ message: err }) }

      // REMOVE REP FROM THE QUESTIONER
      reputation.newValue('remove', 'new-question', userId);

      res.send("Successfully removed question")
    })
  });

}