
var User = require('../models/user.js')
  , Competence = require('../models/competence.js')
  , config = require('../config.js')
  , auth = require('./auth')
  , _ = require('lodash')

module.exports = function(app) {

  // GET INSTRUCTORS
  app.get('/api/competences', auth.ensureAuthenticated, function (req, res) {

  });

  // UPDATE USER COMPETENCE
  app.put('/api/users/:id/competences', auth.ensureAuthenticated, function (req, res) {
    User.findById(req.params.id).exec(function (err, user) {
      // FIND BY NAME
      var competence = _.find(user.competences, { 'name': req.body.name })
      if (competence) {
        // UDPATE SUBDOCUMETN (COMPETENCE) WITH INCREMENT LEVEL ($inc)
        competence.level++
        res.send(user);
      }
      else {
        User.findById(req.userId).exec(function (err, currentUser) {
          var competence = { name: req.body.name, instructor: currentUser._id, level: 1 }
          user.competences.push(competence)
          user.save();
          res.send(user);
        });
      }
    });
  })

}