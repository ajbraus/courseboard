var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;

// var kinds = ['User Interview', 'User Narrative', 'User Testing', 'User Evaluation', 'Code Review']

var UpdateSchema = new Schema({
    createdAt           : { type: Date }
  , updatedAt           : { type: Date }
  
  , body                : { type: String, required: true }
  , kind                : { type: String, required: true }
  
  , user                : { type: Schema.Types.ObjectId, ref: 'User', required: true }
  , product             : { type: Schema.Types.ObjectId, ref: 'Product', required: true }
})

UpdateSchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

UpdateSchema.plugin(mongoosePaginate);

var Update = mongoose.model('Update', UpdateSchema);

module.exports = Update;