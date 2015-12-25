var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;

var QuestionSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }
  , title         : { type: String, required: true }
  , body          : { type: String, required: true }
  , user          : { type: Schema.Types.ObjectId, ref: 'User', required: true}
  , answers       : [{ type: Schema.Types.ObjectId, ref: 'Answer' }]
  
  , tags          : []
  , comments      : [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
  , votes         : [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

QuestionSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

QuestionSchema.plugin(mongoosePaginate);

var Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;