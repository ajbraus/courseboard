var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }
  , user          : { type: Schema.Types.ObjectId, ref: 'User' }
  , type          : { type: String, required: true }
  , parent        : { type: Schema.Types.ObjectId, required: true}
  , body          : { type: String, required: true }
})

CommentSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;