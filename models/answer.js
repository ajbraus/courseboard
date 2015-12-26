var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
    createdAt     : Date
  , updatedAt     : Date 
  , body          : { type: String, required: true }
  , user          : { type: Schema.Types.ObjectId, ref: 'User' }
  , question      : { type: Schema.Types.ObjectId, ref: 'Question' }
  , votes         : [{ type: Schema.Types.ObjectId, ref: 'User' }]

  , comments      : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  , isBest        : { type: Boolean, default: false }
})

AnswerSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Answer = mongoose.model('Answer', AnswerSchema);

module.exports = Answer;