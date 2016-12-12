
var User = require('../models/user.js')
  , Course = require('../models/course.js')
  , Product = require('../models/product.js')
  , Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')
  , _ = require('lodash')


module.exports = function(app) {
  // INDEX
  app.get('/api/products', function (req, res) {
    if (req.query["live"] == "true") {
      Product.find({ liveUrl: { $ne: null } })
            .populate({ path: 'instructor', select: 'fullname first last' })
            .populate({ path: 'contributors', select: 'username' })
            .sort("-createdAt")
            .exec(function(err, products) {
              if (err) { return res.status(400).send(err) }

              res.send(products);
            });
    } else {
      Product.find()
            .populate({ path: 'instructor', select: 'fullname first last' })
            .populate({ path: 'contributors', select: 'username' })
            .sort("-createdAt")
            .exec(function(err, products) {
              if (err) { return res.status(400).send(err) }

              res.send(products);
            });
    }
  });

  // CREATE
  app.post('/api/products', auth.ensureAuthenticated, function (req, res) {
    var product = new Product(req.body);

    product.save(function(err, product) {
      if (err) { return res.status(400).send(err) }

      // ADD TO COURSE
      if (req.body.course) {
        Course.findById(req.body.course).exec(function(err, course) {
          course.products.unshift(product);
          course.save();
        })
      }

      //ADD TO ADVISOR'S PRODUCTS
      if (product.instructor) {
        User.findById(product.instructor).exec(function(err, instructor) {
          instructor.products.unshift(product);
          instructor.save();
        })
      }

      User.findById(req.userId, '+email').exec(function (err, user) {
        if (err) { return res.status(400).send(err) }
        // SEND NOTIFICATION TO INSTRUCTOR
        if (product.instructor) {
          User.findById(product.instructor, '+email').exec(function (err, instructor) {
            app.mailer.send('emails/product-instructor-notification', {
              to: instructor.email,
              subject: 'New Product Advisor: ' + product.name,
              instructor: instructor,
              product: product,
              contributor: user
            }, function (err) {
              if (err) { console.log(err); return }
            });
          })
        }

      });

      // ENROLL CREATOR & ADVISOR
      User.findById(req.userId).exec(function(err, user) {
        product.contributors.push(req.userId);
        if (req.userId != product.instructor) {
          product.contributors.push(product.instructor);
        }
        product.save();

        user.products.unshift(product);
        user.save();

        res.send(product);
      });
    });

  });

  // SHOW
  app.get('/api/products/:id', function (req, res) {
    Product.findById(req.params.id)
          .populate('user')
          .populate({ path: 'contributors', select: '_id fullname username' })
          // .populate('updates')
          .populate({ path: 'instructor', select: 'fullname first last' })
          .populate({ path: 'course', select: 'title' })
          .exec(function (err, product) {

      if (err) { return res.status(400).send(err) }

      res.send(product);
    });
  });

  // UPDATE
  app.put('/api/products/:id', auth.ensureAuthenticated, function (req, res) {
    console.log(req.body);
    Product.findById(req.body._id, function (err, product) {
      if (err) { return error; }
      
      if (!product) { return res.status(400).send({message: 'Product not found' }) }

      var shipping = false;

      if (!product.liveUrl && req.body.liveUrl) {
        var shipping = true;
      }

      product = req.body;

      product.save(function (err, product) {
        if (err) { return error; }

        if (shipping) {
          // create "shipped" update
          // email the advisor (if there is one)
          // email the collaborators (if there are any)
        }
      });
      res.status(200).send(product);
    });
    // Product.findByIdAndUpdate(req.body._id, req.body, function (err, product) {
    //   if (!product) { return res.status(400).send({message: 'Product not found' }) }
    //
    //   res.status(200).send(product);
    // });
  });

  // DELETE
  app.delete('/api/products/:id', auth.ensureAuthenticated, function (req, res) {
    Product.findById(req.params.id).exec(function (err, product) {
      if (err) { return res.status(400).send(err) }

      productId = product._id;
      product.remove();

      res.send("Successfully removed product: " + productId);
    })
  });

  // JOINS A PRODUCT TEAM
  app.put('/api/products/:id/join', auth.ensureAuthenticated, function (req, res) {
    Product.findById(req.params.id, function (err, product) {
      if (!product) { return res.status(400).send({message: 'Product not found' }) }

      if (!(product.contributors.indexOf(req.userId) > -1)) {
        product.contributors.push(req.userId);
        User.findById(req.userId, '+email').exec(function (err, user) {
          if (err) { return res.status(400).send(err) }

          user.products.unshift(product);
          user.save(function(err) {
            // SEND NOTIFICATION TO STUDENT
            app.mailer.send('emails/product-join-notification', {
              to: user.email,
              product: product,
              subject: 'Welcome to ' + product.name,
              user: user
            }, function (err) {
              if (err) { console.log(err); return }
            });
          });

          // SEND NOTIFICATION TO INSTRUCTOR
          User.findById(product.instructor, '+email').exec(function (err, instructor) {
            console.log(instructor)
            app.mailer.send('emails/new-contributor-notification', {
              to: instructor.email,
              subject: 'New Product Member for ' + product.name + ': ' + user.first + " " + user.last,
              instructor: instructor,
              product: product,
              contributor: user
            }, function (err) {
              if (err) { console.log(err); return }
            });
          })
        })
      }
      else { return res.status(400).send({message: 'Already enrolled!'})}
      product.save()

      res.send(product);
    });
  });

  // LEAVE A PRODUCT TEAM
  app.put('/api/products/:id/leave', auth.ensureAuthenticated, function (req, res) {
    Product.findById(req.params.id, function (err, product) {
      if (!product) { return res.status(400).send({message: 'Product not found' }) }

      var index = product.contributors.indexOf(req.userId);

      if (index > -1) {
        product.contributors.splice(index, 1);
        User.findById(req.userId).exec(function (err, user) {
          if (err) { return res.status(400).send(err) }

          user.products.splice(user.products.indexOf(product._id), 1);
          user.save();
        })
      }
      product.save()

      res.send(product);
    });
  });
}
