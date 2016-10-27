var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;

// COMPETENCE SCHEMA
var CompetencySchema = new Schema({
    createdAt           : { type: Date }
  , updatedAt           : { type: Date }
      
  , name                : { type: String, required: true }
  , level               : { type: Number, required: true }
  , kind                : { type: String, required: true }

  // , instructor          : { type: Schema.Types.ObjectId, ref: 'User', required: true}
})

CompetencySchema.pre('save', function(next){
  // SET createdAt AND updatedAt
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Competency = mongoose.model('Competency', CompetencySchema);

module.exports = Competency;
