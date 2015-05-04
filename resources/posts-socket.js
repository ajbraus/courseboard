/*
 * Post Socket
 */

var Post = require('mongoose').model('Post');

exports.create = function(socket) {
  return function(req, res) {
    var post = new Post({
      body: req.body.body
    });
    console.log(post);
    post.save(function (err, post) {
      console.log('post saved')
      if (err) { return res.send(err) };
      // res.json(201, post);
      console.log()
      io.emit('post.published', post);
    });
    // write body of api request to mongodb
    socket.emit();
  }
}