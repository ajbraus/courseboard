
var Course = require('../models/course.js')
, Question = require('../models/question.js')
, Answer = require('../models/answer.js')
, Comment = require('../models/comment.js')
, Tag = require('../models/tag.js')
, auth = require('./auth.js')
, request = require('request')
, config = require('../config.js')
, _ = require('lodash')


module.exports = function(app) {
    // GET COURSES
    app.get('/api/courses/', function (req, res) {
        Course.find().exec((err, courses) => {
            if (err) { return res.status(400).send({ message: err}) }
            res.send(courses);
        });
    });

    // POST COURSE
    app.post('/api/courses', function(req, res) {
        console.log("hi");
        Course.findOne({ title: req.body.title }, function (err, course) {
            if (course) { return res.status(409).send({ message: 'Course already exists.'}); }

            var course = new Course(req.body);
            course.save(function(err) {
                if (err) { return res.status(400).send(err) }

                res.send({ message: 'Course created' });
            })
        })
    });
}
