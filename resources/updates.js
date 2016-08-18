var User = require('../models/user.js')
  , Update = require('../models/update.js')
  , Product = require('../models/product.js')
  , Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')
  , _ = require('lodash')


module.exports = function(app) {
  // CREATE
  app.post('/api/products/:productId/updates', auth.ensureAuthenticated, function (req, res) {
    // Find the product
    Product.findById(req.params.productId).exec(function(err, product) {
      // Make the update object with the model
      var update = new Update(req.body);
      // assign the user of the update
      update.user = req.userId
      // assign the product to the update
      update.product = req.params.productId
      console.log(update);
      //save the update
      update.save(function(err, update) {
        // catch error
        if (err) { return res.status(400).send(err) }
        // unshift update into product.updates
        product.updates.unshift(update)
        // save the product
        product.save();
        
        // send back update
        res.send(update);  
      });      
    })
  });

  // UPDATE
  app.put('/api/updates/:id', auth.ensureAuthenticated, function (req, res) {
    Post.findByIdAndUpdate(req.body._id, req.body, function (err, update) {
      if (!update) { return res.status(400).send({message: 'Post not found' }) }

      res.status(200).send(update);
    });
  });

  // DELETE
  app.delete('/api/products/:productId/updates/:id', auth.ensureAuthenticated, function (req, res) {
    Update.findById(req.params.id).exec(function (err, update) {
      if (err) { return res.status(400).send(err) }

      // Product.findById(req.params.productId).exec(function (err, product) {
      //   product.update({})
      // })

      Product.update({ _id: req.params.productId }, { $pull: { updates: update._id } }, function(err, product) {
        if (err) { return res.status(400).send(err) }

        update.remove();
        res.send("Successfully removed update");
      });
    });
  });

  // INDEX
  app.get('/api/products/:id/updates', function (req, res) {
    Update.find({ product: req.params.id })
          .populate({ path: 'user', select: '_id username' })
          // .populate({ path: 'product', select: 'title' })
          .exec(function (err, updates) {
            
      if (err) { return res.status(400).send(err) }

      res.send(updates);
    });
  });
}
