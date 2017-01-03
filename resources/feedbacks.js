
var User = require('../models/user.js')
  , Competency = require('../models/competency.js')
  , Feedback = require('../models/feedback.js')
  , config = require('../config.js')
  , auth = require('./auth')
  , _ = require('lodash')

module.exports = function(app) {

  // CREATE FEEDBACK
  app.post('/api/user/:id/feedback', auth.ensureAuthenticated, function (req, res) {
    // create feedback
    var feedback = new Feedback(req.body);
    feedback.user = req.params.id;
    feedback.instructor = req.userId;
    
    feedback.save(function (err, feedback) {
      if (err) { return res.status(400).send(err) }
      
      // update users's embedded competencies
      User.findById(req.params.id, '+email').exec(function (err, user) {

        // add feedback to embedded user.feedbacks 
        user.feedbacks.unshift(feedback)
        user.save

        // SEND FEEDBACK TO STUDENT BY EMAIL IF INSTRUCTOR WROTE FEEDBACK
        user.save(function (err, user) {
          if (err) { return res.status(400).send(err) }
          
          if (feedback.user != req.userId) {
            app.mailer.send('emails/feedback', {
              to: user.email,
              feedback: feedback,
              subject: "Feedback or Goal Created",
              user: user
            }, function (err) {
              if (err) { console.log(err); return }
            });
          }

          res.send(feedback);
        });
      });
    });
  });
}