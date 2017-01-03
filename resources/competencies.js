
var User = require('../models/user.js')
  , config = require('../config.js')
  , auth = require('./auth')
  , _ = require('lodash')

module.exports = function(app) {
  // UPDATE USER COMPETENCE
  app.put('/api/user/:id/competencies', auth.ensureAuthenticated, function (req, res) {
    User.findById(req.params.id, '+email').exec(function (err, user) {
      // update user competencies 
      user.competencies = req.body.competencies;

      // save user
      user.save(function (err, user) {
        if (err) { return res.status(400).send(err) }

        res.send(user);
      });
    });
  });
}