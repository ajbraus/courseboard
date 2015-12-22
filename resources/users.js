
var User = require('../models/user.js')
  , qs = require('querystring')
  , jwt = require('jwt-simple')
  , request = require('request')
  , config = require('../config.js')
  , moment = require('moment')
  , auth = require('./auth')

module.exports = function(app) {

  app.get('/api/users/:id', auth.ensureAuthenticated, function (req, res) {
    User.findById(req.params.id, function (err, user) {
      res.send(user);
    });
  });

  app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
    User.findById(req.userId, '+email', function (err, user) {
      res.send(user);
    });
  });

  app.put('/api/me', auth.ensureAuthenticated, function (req, res) {
    console.log(req.body)
    User.findById(req.userId, function (err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      
      user.email = req.body.email || user.email;
      user.type = req.body.type  || user.type;
      user.first = req.body.first || user.first;
      user.last = req.body.last || user.last;
      user.username = req.body.username || user.username;
      user.location = req.body.location || user.location;

      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

  app.post('/auth/login', function (req, res) {
    User.findOne({ email: req.body.email }, '+password', function (err, user) {
      // CHECK IF ACCOUNT EXISTS
      if (!user) {
        return res.status(401).send({ message: 'Wrong email or password' });
      }
      
      // CHECK CONFIRMEDAT
      if (!user.confirmedAt) {
        return res.status(401).send({ message: 'Awaiting confirmation' });
      }

      // CHECK PASSWORD
      user.comparePassword(req.body.password, function (err, isMatch) {
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong email or password' });
        }
        res.send({ token: auth.createJWT(user) });
      });
    });
  });

  app.post('/auth/signup', function (req, res) {
    User.findOne({ email: req.body.email }, function (err, user) {
      if (user) {
        return res.status(409).send({ message: 'Email is already taken' });
      }
      var user = new User(req.body);
      user.save(function(err) {
        if (err) { return res.status(400).send({ message: err }) }

        // res.send({ token: auth.createJWT(user) });
        res.send({ message: "Access requested" });
      });
    });
  });

  app.post('/auth/passwords', function (req, res) {
    // Find User by email
    User.findOne({ email: req.body.email }, '+email', function (err, user) {
      if (!user) {
        return res.status(409).send({ message: 'No account found with that email' });
      }

      console.log(user)
      // Generate Token & Set Expiration
      user.resetPasswordToken = auth.generateResetPasswordToken();
      user.resetPasswordExp = Date.now() + 3600000; // 1 hour

      user.save(function (err) {
        // Send Email
        console.log(user.email)
        app.mailer.send('emails/new-password', {
          to: user.email,
          subject: 'New Password Request',
          user: user
        }, function (err) {
          if (err) { console.log(err); return }
        });

        res.send({ message: "Password reset instructions sent" })
      });
    })
    
  });

  app.put('/auth/passwords/edit/:token', function (req, res) {
    // Find user by token
    User.findOne({ resetPasswordToken: req.params.token }).where('resetPasswordExpires').gt(Date.now()).exec(function (err, user) {
      if (!user) {
        return res.status(409).send({ message: 'Token is not valid' });
      }
      // Set New password
      user.password = req.body.password;
      // Remove token
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function (err) {
        if (err) { return res.status(400).send({ message: 'New password is invalid' }) }

        res.send({ message: "Password successfully reset" })
      });
    })
  })

}