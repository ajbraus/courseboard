/*
 * Zoink Resource
 */

var Zoink = require('../models/zoink.js');

module.exports = function(app) {
  // INDEX
  app.get('/api/zoinks', function (req, res) {
    Zoink.find().sort('-created_at').exec(function(err, zoinks) {
      if (err) { return res.status(404).send(err) };
      res.status(200).json(zoinks); // return all nerds in JSON format
    });
  })
  
  // SHOW
  app.get('/api/zoinks/:id', function (req, res) {
    Zoink.findById(req.params.id).exec(function(err, zoink) {
      if (err) { return res.status(404).send(err) };
      res.status(200).json(zoink); // return all nerds in JSON format
    });
  });

  //CREATE
  app.post('/api/zoinks', function (req, res) {
    var zoink = new Zoink(req.body);
    zoink.save(function (err, zoink) {
      if (err) { return res.status(200).send(err) };
      res.status(201).json(zoink); 
    });
  });

  // // UPDATE
  app.put('/api/zoinks/:id', function (req, res) {
    Zoink.findByIdAndUpdate(req.params.id, req.body, function (err, zoink) {
      if (err) { return res.send(err) }
      res.status(200).json(zoink)
    });
  });

  // // DESTROY
  app.delete('/api/zoinks/:id', function (req, res) { 
    Zoink.findByIdAndRemove(req.params.id, function (err) {
      if (err) { return res.send(err) }
      res.status(204);
    });
  });
}