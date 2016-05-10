
var User = require('../models/user.js')
  , Product = require('../models/product.js')
  , Tag = require('../models/tag.js')
  , auth = require('./auth.js')
  , request = require('request')
  , config = require('../config.js')
  , _ = require('lodash')


module.exports = function(app) {
  // INDEX
  app.get('/api/products', function (req, res) {
    // RETURN COURSES THAT START FEWER THAN 10 DAYS AGO
    var d = new Date();
    d.setDate(d.getDate()-10);

    Product.find({ "startsOn": { "$gte": d } })
          .populate({ path: 'instructor', select: 'fullname first last' })
          .exec(function(err, products) {
            // {"created_on": {"$gte": new Date(2012, 7, 14), "$lt": new Date(2012, 7, 15)}})
            if (err) { return res.status(400).send(err) }

            res.send(products);
          });
  });

  // CREATE
  app.post('/api/products', auth.ensureAuthenticated, function (req, res) {
    console.log('here');
    var product = new Product(req.body);
    product.user = req.userId

    product.save(function(err, product) {
      if (err) { return res.status(400).send(err) }

      // ENROLL CREATOR
      User.findById(product.instructor).exec(function(err, user) {
        product.contributors.push(req.userId);
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
          .populate('students')
          .populate('posts')
          .populate({ path: 'instructor', select: 'fullname first last' })
          .exec(function (err, product) {
            
      if (err) { return res.status(400).send(err) }

      res.send(product);
    });
  });

  // UPDATE
  app.put('/api/products/:id', auth.ensureAuthenticated, function (req, res) {
    console.log(req.body)
    Product.findByIdAndUpdate(req.body._id, req.body, function (err, product) {
      if (!product) { return res.status(400).send({message: 'Product not found' }) }

      res.status(200).send(product);
    });
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

  // ENROLL
  app.put('/api/products/:id/enroll', auth.ensureAuthenticated, function (req, res) {
    Product.findById(req.params.id, function (err, product) {
      if (!product) { return res.status(400).send({message: 'Product not found' }) }

      if (!(product.students.indexOf(req.userId) > -1)) {
        product.students.push(req.userId);
        User.findById(req.userId, '+email').exec(function (err, user) {
          if (err) { return res.status(400).send(err) }

            console.log(user)

          user.products.unshift(product);
          user.save(function(err) {
            // SEND NOTIFICATION TO STUDENT
            app.mailer.send('emails/student-enroll-notification', {
              to: user.email,
              product: product,
              subject: 'Welcome to ' + product.title,
              user: user
            }, function (err) {
              if (err) { console.log(err); return }
            });
          });

          // SEND NOTIFICATION TO INSTRUCTOR
          User.findById(product.instructor, '+email').exec(function (err, instructor) {
            console.log(instructor)
            app.mailer.send('emails/enroll-notification', {
              to: instructor.email,
              subject: 'New Student: ' + user.first + " " + user.last,
              instructor: instructor,
              product: product,
              student: user
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

  // UNENROLL
  app.put('/api/products/:id/unenroll', auth.ensureAuthenticated, function (req, res) {
    Product.findById(req.params.id, function (err, product) {
      if (!product) { return res.status(400).send({message: 'Product not found' }) }

      var index = product.students.indexOf(req.userId);
    
      if (index > -1) {
        product.students.splice(index, 1);
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