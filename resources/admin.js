var User = require('../models/user.js')
  , qs = require('querystring')
  , jwt = require('jwt-simple')
  , request = require('request')
  , config = require('../config.js')
  , moment = require('moment')
  , auth = require('./auth')

module.exports = function(app) {

  app.get('/api/admin/unconfirmed-users', auth.ensureAuthenticated, auth.ensureAdmin, function (req, res) {
    User.find({ confirmedAt: null }, '+email').exec(function (err, users) {
      res.send(users)
    })
  })

  app.put('/api/admin/confirm/:userId', auth.ensureAuthenticated, auth.ensureAdmin, function (req, res) {
    User.findById(req.params.userId, '+email').exec(function (err, user) {
      user.confirmedAt = Date.now();
      user.save(function (err) {
        
        console.log(user.email)
        // SEND CONFIRMATION EMAIL
        app.mailer.send('emails/confirmed', {
          to: [user.email],
          subject: 'Account Confirmed: Welcome to GA Q&A',
          user: user
        }, function (err) {
          if (err) { console.log(err); return }
        });

        res.send({ message: "User confirmed"})
      });
    })
  })
  
}