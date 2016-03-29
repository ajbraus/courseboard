var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;

var PostSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , body          : { type: String, required: true }
  , dueDate       : { type: Date }
  , kind          : { type: String, required: true }

  , user          : { type: Schema.Types.ObjectId, ref: 'User', required: true}
  , course        : { type: Schema.Types.ObjectId, ref: 'Course', required: true}
  // , comments      : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

PostSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

PostSchema.plugin(mongoosePaginate);

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;