var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    created_at    : { type: Date }
  , updated_at    : { type: Date }
  , body          : { type: String, required: true }
  , comments      : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  , votes         : [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

AnswerSchema.pre('save', function(next){
  // SET CREATED_AT AND UPDATED_AT
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;