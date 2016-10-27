var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Competency = require('./competency.js')
  , Schema = mongoose.Schema;

var FeedbackSchema = new Schema({
    createdAt           : { type: Date }
  , updatedAt           : { type: Date }
    
  , body                : { type: String, required: true }
  , competencies        : [Competency.schema]

  , instructor          : { type: Schema.Types.ObjectId, ref: 'User', required: true}
  , user                : { type: Schema.Types.ObjectId, ref: 'User', required: true}
})

// SET createdAt and updatedAt
FeedbackSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
