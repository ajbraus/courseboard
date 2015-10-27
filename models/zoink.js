/*
 * ZOINK MODEL
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
    content     : { type: String, required: true }
  , author      : {}
  , created_at  : { type: Date }
  , updated_at  : { type: Date }
});

var ZoinkSchema = new Schema({
    created_at  : { type: Date }
  , updated_at  : { type: Date }
  , title       : { type: String, required: true, trim: true }
  , location    : String
  , startsAt    : Date
  , endsAt      : Date
  , invites     : []
  , todos       : []
  , messages    : [MessageSchema]
  , purchases   : []
  , carpools    : []
  , reqs        : []
  , user        : { type: Number, ref: 'User' }
});

MessageSchema.pre('save', function(next){
  // SET CREATED_AT AND UPDATED_AT
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

ZoinkSchema.pre('save', function(next){
  // SET CREATED_AT AND UPDATED_AT
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

var Zoink = mongoose.model('Zoink', ZoinkSchema);

module.exports = Zoink;