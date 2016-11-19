var mongoose = require('mongoose')
  , mongoosePaginate = require('mongoose-paginate')
  , Schema = mongoose.Schema;


function toTitle(v) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}


var ProductSchema = new Schema({
    createdAt     : { type: Date }
  , updatedAt     : { type: Date }

  , lastUpdatedAt       : { type: Date }

  , name                : { type: String, required: true }
  , githubUrl           : { type: String }
  , agileUrl            : { type: String }
  , liveUrl             : { type: String }
  , problem             : { type: String, required: true }
  , assumptions         : String
  , finishedProduct     : String
  , mvp                 : String

  , marketFit           : Number
  , nps                 : Number

  , customer                : String
  , valueProposition        : String
  , channels                : String
  , customerRelationships   : String
  , revenueStreams          : String
  , keyActivities           : String
  , keyResources            : String
  , keyPartners             : String
  , costStructure           : String

  , course              : { type: Schema.Types.ObjectId, ref: 'Course' }
  , instructor          : { type: Schema.Types.ObjectId, ref: 'User', required: true }
  , contributors        : [{ type: Schema.Types.ObjectId, ref: 'User' }]
  , updates             : [{ type: Schema.Types.ObjectId, ref: 'Update' }]
})

// Compound index
ProductSchema.index({
    name: 'text'
  , body:  'text'
  , tags:  'text'
  , weights: {
      name: 3,
      body:  1,
      tags:  5
    }
});

// SET createdAt and updatedAt
ProductSchema.pre('save', function(next) {
  now = new Date();
  this.updatedAt = now;
  if ( !this.createdAt ) {
    this.createdAt = now;
  }
  next();
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
