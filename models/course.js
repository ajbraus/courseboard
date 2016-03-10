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

var CourseSchema = new Schema({
    createdAt          : Date
  , updatedAt          : Date
  , title              : String
  , instructor         : String
  , description        : String
  // , email              : { type: String, required: true, select:false, unique: true, trim: true, set: toLower }
  // , password           : { type: String, select: false, trim: true }
  // , first              : { type: String, trim: true, set: toTitle }
  // , last               : { type: String, trim: true, set: toTitle }
  // , username           : { type: String, trim: true, set: toLower }
  // , admin              : { type: Boolean, default: false }
  // , confirmedAt        : { type: Date, default: undefined }
  // , resetPasswordToken : String
  // , resetPasswordExp   : Date
})

CourseSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
