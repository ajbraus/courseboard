
var Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , _ = require('lodash');

module.exports = function(app) {
  // SEARCH
  app.post('/api/tags', auth.ensureAuthenticated, function (req, res) { 
    Tag.create(req.body, function (err, tag) {
      if (err) { return res.status(400).send(err) }
      res.send(tag);
    });
  });

  app.get('/api/all-tags', auth.ensureAuthenticated, function (req, res) {
    Tag.find().exec(function(err, tags) {
      if (err) { return res.status(400).send(err) }
      res.send(tags);
    });
  });

  app.get('/api/tags', auth.ensureAuthenticated, function (req, res) {
    var regex = new RegExp(req.query.term);
    console.log(regex)

    Tag.find({ "name": regex }).limit(7).exec(function(err, tags) {
      if (err) { return res.status(400).send(err) }
      tags = _.pluck(tags, "name");
      res.send(tags);
    });
  });

}