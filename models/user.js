var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    Schema = mongoose.Schema;

// GETTER
function toLower (v) {
  return v.toLowerCase();
}

function toTitle(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

var UserSchema = new Schema({
    createdAt          : Date
  , updatedAt          : Date
  , email              : { type: String, required: true, select:false, unique: true, trim: true, set: toLower }
  , password           : { type: String, select: false, trim: true }
  , first              : { type: String, trim: true, set: toTitle }
  , last               : { type: String, trim: true, set: toTitle }
  , username           : { type: String, trim: true, set: toLower }
  , admin              : { type: Boolean, default: false }
  , confirmedAt        : { type: Date, default: undefined }
  , resetPasswordToken : String
  , resetPasswordExp   : Date
})

UserSchema.virtual('fullname').get(function() {
  return this.first + ' ' + this.last;
});

UserSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }

  // ENCRYPT PASSWORD
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
});


UserSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
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