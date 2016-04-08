var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;


function toTitle(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}


var CourseSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , title         : { type: String, required: true }
  , description   : { type: String, required: true }
  , instructor    : { type: String, set: toTitle }
  , duration      : { type: String }
  , startsOn      : { type: Date }
  , endsOn        : { type: Date }

  , user          : { type: Schema.Types.ObjectId, ref: 'User', required: true }
  , students      : [{ type: Schema.Types.ObjectId, ref: 'User' }]
  , posts         : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
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
