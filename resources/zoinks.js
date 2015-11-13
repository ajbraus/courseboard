/*
 * Zoink Resource
 */

var Zoink = require('../models/zoink.js')
  , User = require('../models/user.js')
  , auth = require('./auth');

module.exports = function(app) {
  
  // USER'S ZOINKS & RSVPS
  app.get('/api/zoinks', auth.ensureAuthenticated, function (req, res) {
    Zoink.find({ $or: [{ user: req.userId }, { rsvps: req.userId }] }).sort('-created_at').exec(function(err, zoinks) {
      if (err) { return res.send(err) };
      res.status(200).json(zoinks); // return all nerds in JSON format
    });
  });

  // USER's INVITES
  app.get('/api/invites', auth.ensureAuthenticated, function(req, res) {
    Zoink.find({ invites: req.userEmail }, function(err, zoinks) {
      console.log(zoinks)
      res.send(zoinks);
    });
  });

  // SHOW
  app.get('/api/zoinks/:id', function (req, res) {
    Zoink.findById(req.params.id).populate('rsvps').exec(function(err, zoink) {
      if (err) { return res.send(err) };
      console.log(zoink)
      res.status(200).json(zoink); // return all nerds in JSON format
    });
  });

  //CREATE
  app.post('/api/zoinks', auth.ensureAuthenticated, function (req, res) {
    var zoink = new Zoink(req.body);
    zoink.user = req.userId;
    User.findById(req.userId, function (err, user) {
      console.log('hell')
      console.log(user)
      if (err) { return console.log(err) }
      zoink.rsvps.push(user);
      zoink.save(function (err) {
        if (err) { return res.send(err) };
        res.status(201).json(zoink); 
      });      
    })
  });

  // // UPDATE
  app.put('/api/zoinks/:id', auth.ensureAuthenticated, function (req, res) {
    Zoink.findByIdAndUpdate(req.params.id, req.body, function (err, zoink) {
      if (err) { return res.send(err) }
      res.status(200).json(zoink)
    });
  });

  // // DESTROY
  app.delete('/api/zoinks/:id', auth.ensureAuthenticated, function (req, res) { 
    Zoink.findByIdAndRemove(req.params.id, function (err) {
      if (err) { return res.send(err) }
      res.status(204);
    });
  });
}