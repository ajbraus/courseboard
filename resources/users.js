
var User = require('../models/user.js')
  , qs = require('querystring')
  , jwt = require('jwt-simple')
  , request = require('request')
  , config = require('../config.js')
  , moment = require('moment')
  , auth = require('./auth')
  , Zoink = require('../models/zoink.js')

module.exports = function(app) {

  app.get('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.userId, function(err, user) {
      console.log(user)
      res.send(user);
    });
  });

  app.put('/api/me', auth.ensureAuthenticated, function(req, res) {
    User.findById(req.userId, function(err, user) {
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.save(function(err) {
        res.status(200).end();
      });
    });
  });

  app.post('/auth/login', function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
      if (!user) {
        return res.status(401).send({ message: 'Wrong email or password' });
      }
      user.comparePassword(req.body.password, function(err, isMatch) {
        console.log(isMatch)
        if (!isMatch) {
          return res.status(401).send({ message: 'Wrong email or password' });
        }
        res.send({ token: auth.createJWT(user) });
      });
    });
  });

  app.post('/auth/signup', function(req, res) {
    User.findOne({ email: req.body.email }, function(err, existingUser) {
      if (existingUser) {
        return res.status(409).send({ message: 'Email is already taken' });
      }
      var user = new User({
        email: req.body.email,
        password: req.body.password,
        displayName: req.body.displayName,
        picture: "http://placehold.it/50x50"
      });
      user.save(function(err) {
        if (err) { return res.status(400).send({err: err}) }

        // SEND WELCOME EMAIL
        app.mailer.send('emails/welcome', {
          to: user.email,
          subject: 'Welcome to Zoinks!'
        }, function (err) {
          if (err) { console.log(err); return }
        });

        res.send({ token: auth.createJWT(user) });
      });
    });
  });

  app.post('/auth/facebook', function(req, res) {
    var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
    var graphApiUrl = 'https://graph.facebook.com/v2.3/me?fields=id,email,first_name,gender,last_name,link,name';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.FACEBOOK_SECRET,
      redirect_uri: req.body.redirectUri
    };

    // Step 1. Exchange authorization code for access token.
    request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: accessToken.error.message });
      }

      // Step 2. Retrieve profile information about the current user.
      request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
        if (response.statusCode !== 200) {
          return res.status(500).send({ message: profile.error.message });
        }

        // if token present (logged in already)
        if (req.headers.authorization) {
          // look up user with facebook profile
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              // if user found, refresh the token with this user and send it back
              return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
            } // else use the token to find the user by their id
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            
            console.log("payload:", payload.sub);
            User.findById(payload.sub, function(err, user) {
              // user does not exist from token id 
              if (!user) {
                // try to find the 
                if (!user) { return res.status(400).send({ message: 'User not found' }) };
              }
              user.facebook = profile.id;
              user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
              user.displayName = user.displayName || profile.name;
              user.first = profile.first_name;
              user.last = profile.last_name;
              user.save(function() {
                var token = auth.createJWT(user);
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ facebook: profile.id }, function(err, existingUser) {
            if (existingUser) {
              var token = auth.createJWT(existingUser);
              return res.send({ token: token });
            }
            var user = new User();
            user.facebook = profile.id;
            user.email = profile.email;
            user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
            user.displayName = profile.name[0];
            user.first = profile.first_name;
            user.last = profile.last_name;
            user.save(function (err) {
              if (err) { return res.status(400).send({ message: "there was an err: " + err})}
              var token = auth.createJWT(user);
              res.send({ token: token });
            });
          });
        }
      });
    });
  });

  app.post('/auth/google', function(req, res) {
    var accessTokenUrl = 'https://accounts.google.com/o/oauth2/token';
    var peopleApiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.GOOGLE_SECRET,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };

    // Step 1. Exchange authorization code for access token.
    request.post(accessTokenUrl, { json: true, form: params }, function(err, response, token) {
      var accessToken = token.access_token;
      var headers = { Authorization: 'Bearer ' + accessToken };
      console.log("accessToken", accessToken);
      // Step 2. Retrieve profile information about the current user.
      request.get({ url: peopleApiUrl, headers: headers, json: true }, function(err, response, profile) {
        console.log("profile:", profile)
        if (profile.error) {
          return res.status(500).send({message: profile.error.message});
        }
        // Step 3a. Link user accounts.
        if (req.headers.authorization) {
          console.log('linking google account')
          User.findOne({ google: profile.sub }, function(err, existingUser) {
            if (existingUser) {
              return res.status(409).send({ message: 'There is already a Google account that belongs to you' });
            }
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, config.TOKEN_SECRET);
            User.findById(payload.sub, function(err, user) {
              if (!user) {
                return res.status(400).send({ message: 'User not found' });
              }
              user.google = profile.sub;
              user.picture = user.picture || profile.picture.replace('sz=50', 'sz=200');
              user.displayName = user.displayName || profile.name;
              user.save(function() {
                var token = auth.createJWT(user);
                res.send({ token: token });
              });
            });
          });
        } else {
          // Step 3b. Create a new user account or return an existing one.
          User.findOne({ google: profile.sub }, function(err, existingUser) {
            if (existingUser) {
              return res.send({ token: auth.createJWT(existingUser) });
            }
            console.log('creating new user from google profile')
            var user = new User();
            user.google = profile.sub;
            user.first = profile.given_name;
            user.last = profile.family_name;
            user.picture = profile.picture.replace('sz=50', 'sz=200');
            user.displayName = profile.name;
            user.email = profile.email;
            user.save(function(err) {
              console.log('err:', err);
              var token = auth.createJWT(user);
              res.send({ token: token });
            });
          });
        }
      });
    });
  });
}