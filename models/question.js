var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    created_at    : { type: Date }
  , updated_at    : { type: Date }
  , title         : { type: String, required: true }
  , body          : { type: String, required: true }
  , answers       : [{ type: Number, ref: 'Answer' }]
  , comments      : [{ type: Number, ref: 'Comment' }]
  , votes         : [{ type: Number, ref: 'User' }]
})

QuestionSchema.pre('save', function(next){
  // SET CREATED_AT AND UPDATED_AT
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;