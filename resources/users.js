
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , qs = require('querystring')
  , jwt = require('jwt-simple')
  , request = require('request')
  , config = require('../config.js')
  , moment = require('moment')
  , auth = require('./auth')

module.exports = function(app) {

  // GET INSTRUCTORS
  app.get('/api/instructors', auth.ensureAuthenticated, function (req, res) {
    User.find({ role: "Instructor" }).exec(function (err, instructors) {
      res.send(instructors);
    });
  });

  // GET USER
  app.get('/api/users/:id', auth.ensureAuthenticated, function (req, res) {
    User.findById(req.params.id).populate('courses').exec(function (err, user) {
      res.send(user);
    });
  });

  // CURRENT USER
  app.get('/api/me', auth.ensureAuthenticated, function (req, res) {
    User.findById(req.userId, '+email').populate('courses').exec(function (err, user) {
      res.send(user);
    });
  });

  // UPDATE USER
  app.put('/api/me', auth.ensureAuthenticated, function (req, res) {
    User.findByIdAndUpdate(req.userId, req.body, function (err, user) {
      if (!user) { return res.status(400).send({ message: 'User not found' }) };
      console.log(user)
      res.status(200).send(user);
    });
  });

  // LOGIN
  app.post('/auth/login', function (req, res) {
    console.log(req.body.email)
    User.findOne({ email: req.body.email }, '+password', function (err, emailUser) {
      User.findOne({ username: req.body.email }, '+password', function(err, usernameUser) {
        // CHECK IF ACCOUNT EXISTS
        var user = emailUser || usernameUser;
        if (!user) {
          return res.status(401).send({ message: 'Wrong email or password' });
        }
        // CHECK CONFIRMEDAT
        // if (!user.confirmedAt) {
        //   return res.status(401).send({ message: 'Awaiting confirmation' });
        // }

        // CHECK PASSWORD
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (!isMatch) {
            return res.status(401).send({ message: 'Wrong email or password' });
          }
          var token = auth.createJWT(user);
          res.send({ token: token });
        });
      });
    });
  });

  // SIGNUP 
  app.post('/auth/signup', function (req, res) {
    User.findOne({ email: req.body.email }, '+password', function (err, emailUser) {
      User.findOne({ username: req.body.username }, '+password', function(err, usernameUser) {
        // CHECK IF EMAIL TAKEN
        if (emailUser) {
          return res.status(409).send({ message: 'Email is already taken' });
        }
        // CHECK IF USERNAME TAKEN
        if (usernameUser) {
          return res.status(409).send({ message: 'Username is already taken' });
        }
        var user = new User(req.body);
        user.save(function(err) {
          if (err) { return res.status(400).send(err) }

          res.send({ token: auth.createJWT(user) });

          app.mailer.send('emails/welcome', {
            to: user.email,
            subject: 'Welcome to Courseboard',
            user: user
          }, function (err) {
            if (err) { console.log(err); return }
          });
        });
      });
    });
  });

  // REQUEST PASSWORD
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

  // UPDATE PASSWORD
  app.put('/auth/passwords/edit/:token', function (req, res) {
    // Find user by token
    console.log(req.body);
    User.findOne({ resetPasswordToken: req.params.token }).where('resetPasswordExp').gt(Date.now()).exec(function (err, user) {
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