var User = require('../models/user.js');

module.exports = {
  newValue: function(direction, e, userId) {
    switch(e) {
      case "new-question":
        val = 5;
        break;
      case "new-answer":
        val = 10;
        break;
      case "new-question-vote":
        val = 1;
        break;
      case "new-answer-vote":
        val = 2;
        break;
      case "new-follower":
        val = 2;
        break;
    }

    if (direction == 'remove') {
      val = val * -1
    }

    User.findById(userId).exec(function (err, user) {
      if (err) { return err }
      user.rep = user.rep + val;
      user.save(function (err) {
        return user;
      })
    })
  }
}