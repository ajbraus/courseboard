var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    created_at    : { type: Date }
  , updated_at    : { type: Date }
  , user          : { type: Schema.Types.ObjectId, ref: 'User' }
  , type          : { type: String, required: true }
  , body          : { type: String, required: true }
})

CommentSchema.pre('save', function(next){
  // SET CREATED_AT AND UPDATED_AT
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;