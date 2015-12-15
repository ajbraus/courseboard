var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    created_at    : { type: Date }
  , updated_at    : { type: Date }
  , body          : { type: String, required: true }
  , comments      : [{ type: Number, ref: 'Comment' }]
  , votes         : [{ type: Number, ref: 'User' }]
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