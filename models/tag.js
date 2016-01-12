var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var TagSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }
  , name          : { type: String, required: true }
  , count         : { type: Number, default: 0 }
})
 
TagSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Tag = mongoose.model('Tag', TagSchema);

module.exports = Tag;