var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;

function toTitle(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

var CourseSchema = new Schema({
    createdAt     : Date
  , updatedAt     : Date
  , publishedAt   : Date

  , title         : { type: String, required: true }
  , description   : String
  , prerequisites : String

  , quarter       : String
  , weekDays      : String
  , startTime     : String
  , location      : String

  // , startsOn      : Date
  // , startsOnDay   : String
  // , startsOnMonth : String
  // , startsOnYear  : String

  // , endsOn        : Date
  // , endsOnDay     : String
  // , endsOnMonth   : String
  // , endsOnYear    : String

  , objectives    : [String]

  , user          : { type: Schema.Types.ObjectId, ref: 'User', required: true }
  , instructor    : { type: Schema.Types.ObjectId, ref: 'User' }
  , coInstructor  : { type: Schema.Types.ObjectId, ref: 'User' }
  , students      : [{ type: Schema.Types.ObjectId, ref: 'User' }]
  , posts         : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
  , products      : [{ type: Schema.Types.ObjectId, ref: 'Product' }]
})

// Compound index
CourseSchema.index({
    title: 'text'
  , body:  'text'
  , tags:  'text'
  , weights: {
      title: 3,
      body:  1,
      tags:  5
    }
});

// SET createdAt and updatedAt
CourseSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
