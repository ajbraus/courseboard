var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;

var CourseSchema = new Schema({
  createdAt     : { type: Date }
  , updatedAt     : { type: Date }
  , title         : { type: String, required: true }
  , description   : { type: String, required: true }
})
 
CourseSchema.index(
  { 
    title: 'text'
    , body: 'text' 
    , tags: 'text'
    , weights: {
        title: 3,
        body: 1,
        tags: 5
      }
  }
);

CourseSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Course = mongoose.model('Course', CourseSchema);

module.exports = Course;