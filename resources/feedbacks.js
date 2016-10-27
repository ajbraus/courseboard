
var User = require('../models/user.js')
  , Competency = require('../models/competency.js')
  , Feedback = require('../models/feedback.js')
  , config = require('../config.js')
  , auth = require('./auth')
  , _ = require('lodash')

module.exports = function(app) {

  // CREATE FEEDBACK
  app.post('/api/user/:id/feedback', auth.ensureAuthenticated, function (req, res) {
    console.log('hello')
    // create feedback
    var feedback = new Feedback(req.body);
    feedback.user = req.params.id;
    feedback.instructor = req.userId;
    
    feedback.save(function (err, feedback) {
      if (err) { return res.status(400).send(err) }
      
      // update users's embedded competencies
      User.findById(req.params.id).exec(function (err, user) {

        // add feedback to embedded user.feedbacks 
        user.feedbacks.push(feedback)

        // update user competencies 
        user.competencies = req.body.competencies;

        // save user
        user.save(function (err, user) {
          console.log(user);
          if (err) { return res.status(400).send(err) }
          res.send(feedback);
        });

      });
    });
  });

  // UPDATE USER COMPETENCE
  // app.put('/api/users/:id/competencies', auth.ensureAuthenticated, function (req, res) {
  //   User.findById(req.params.id).exec(function (err, user) {
  //     // FIND BY NAME
  //     var competency = _.find(user.competencies, { 'name': req.body.name })
  //     if (competency && req.body.level <= 5 && req.body.level >= 0) {
  //       // UDPATE SUBDOCUMENT LEVEL
  //       competency.level = req.body.level
  //       user.save();
  //       res.send(user);
  //     }
  //     else {
  //       User.findById(req.userId).exec(function (err, currentUser) {
  //         var competency = { name: req.body.name, instructor: currentUser._id, level: 1, kind: req.body.kind }
  //         user.competencies.push(competency)
  //         user.save();
  //         res.send(user);
  //       });
  //     }
  //   });
  // })

}