
var User = require('../models/user.js')
  , Competency = require('../models/competency.js')
  , config = require('../config.js')
  , auth = require('./auth')
  , _ = require('lodash')

module.exports = function(app) {

  // GET INSTRUCTORS
  app.get('/api/competencies', auth.ensureAuthenticated, function (req, res) {

  });

  // UPDATE USER COMPETENCE
  app.put('/api/users/:id/competencies', auth.ensureAuthenticated, function (req, res) {
    User.findById(req.params.id).exec(function (err, user) {
      // FIND BY NAME
      var competency = _.find(user.competencies, { 'name': req.body.name })
      if (competency && req.body.level <= 5 && req.body.level >= 0) {
        // UDPATE SUBDOCUMENT LEVEL
        competency.level = req.body.level
        user.save();
        res.send(user);
      }
      else {
        User.findById(req.userId).exec(function (err, currentUser) {
          var competency = { name: req.body.name, instructor: currentUser._id, level: 1, kind: req.body.kind }
          user.competencies.push(competency)
          user.save();
          res.send(user);
        });
      }
    });
  })

}