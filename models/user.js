var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

// GETTER
function toLower (v) {
  return v.toLowerCase();
}

var UserSchema = new Schema({
    created_at  : { type: Date }
  , updated_at  : { type: Date }
  , username    : { type: String, required: true, unique: true, trim: true, set: toLower }
  , email       : { type: String, required: true, unique: true, trim: true, set: toLower }
  , first       : { type: String, required: true, trim: true }
  , last        : { type: String, required: true, trim: true }
  , facebook: String
  , google: String
  , password    : String
  , provider: String
  , providerId: String
  , providerData: {}
  , todos: {}

})

UserSchema.virtual('fullname').get(function() {
  return this.first + ' ' + this.last;
});

UserSchema.pre('save', function(next){
  // SET CREATED_AT AND UPDATED_AT
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();

  // ENCRYPT PASSWORD
  if (this.password) {
    var user = this;
    if (!user.isModified('password')) {
      return next();
    }
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
      });
    });
  }
  next();
});


UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');

  _this.findOne(
    {username: possibleUsername},
    function(err, user) {
      if (!err) {
        if (!user) {
          callback(possibleUsername);
        }
        else {
          return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
        }
      }
      else {
        callback(null);
      }
    }
  );
};

// SETTER
// function obfuscate (cc) {
//   return '****-****-****-' + cc.slice(cc.length-4, cc.length);
// }

// var AccountSchema = new Schema({
//   creditCardNumber: { type: String, get: obfuscate }
// });

var User = mongoose.model('User', UserSchema);

module.exports = User;