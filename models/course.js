var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;

var CourseSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }
  , title         : { type: String, required: true }
  , description   : { type: String, required: true }
  , instructor    : { type: String, required: true }
  , duration      : { type: String, required: true }
  // , body          : { type: String, required: true }
  // , user          : { type: Schema.Types.ObjectId, ref: 'User', required: true}
  // , answers       : [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
  // , votes         : [{ type: Schema.Types.ObjectId, ref: 'User' }]
  // , impressions   : { type: Number, default: 0 } //[{ type: Schema.Types.ObjectId, ref: 'User' }]
  // , tags          : [String]
  // , isAnonymous   : { type: Boolean, default: false }
  //
  // , isAnswered    : { type: Boolean, default: false }
  // , comments      : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

// for Mongos' full text search
// CourseSchema.index(
//   {
//     title: 'text'
//     , body: 'text'
//     , tags: 'text'
//     , weights: {
//         title: 3,
//         body: 1,
//         tags: 5
//       }
//   }
// );

CourseSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

CourseSchema.plugin(mongoosePaginate);

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;
