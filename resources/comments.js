
var User = require('../models/user.js')
  , Question = require('../models/question.js')
  , Answer = require('../models/answer.js')
  , Comment = require('../models/comment.js')
  , auth = require('./auth.js')
  , config = require('../config.js')

module.exports = function(app) {
  // COMMENTS CREATE
  app.post('/api/parent/:parentId/comments', auth.ensureAuthenticated, function (req, res) { 
    req.body.parent = req.params.parentId;
    Comment.create(req.body).exec(function (err, comment) {
      if (err) { return res.send(err) }

      if (comment.type == "question") {
        Question.findById(req.params.parentId).exec(function (err, question) {
          question.comments.push(comment);
          question.save();
          return res.send(comment);
        });
      } else if (comment.type == "answer") {
        Answer.findById(req.params.parentId).exec(function (err, answer) {
          answer.comments.push(comment);
          answer.save();
          return res.send(comment);
        });
      }      
    })
  });

  app.delete('/api/parent/:parentId/comments/:commentId', auth.ensureAuthenticated, function (req, res) {
    Comment.findById(req.commentId).exec(function (err, comment) {
      if (comment.type == "question") {
        Question.findById(comment.parent, function (err, question) {
          question.comments.pull({ _id: comment._id })
          question.save();
          comment.remove();
          res.send("Successfully removed comment from question");
        });
      } else if (comment.type == "answer") {
        Answer.findById(comment.parent, function (err, answer) {
          answer.comments.pull({ _id: comment._id })
          answer.save();
          comment.remove();
          res.send("Successfully removed comment from answer ");
        });
      }
    })
  })
}