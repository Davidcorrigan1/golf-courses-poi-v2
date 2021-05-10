"use strict";

const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const golfPOISchema = new Schema({
  courseName: String,
  courseDesc: String,
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "LocationCategory",
  },
  relatedImages: [],
  location: {
    type: {type: String, default: 'Point'},
    coordinates: {type: [Number], default: [0,0]}
  },
});

golfPOISchema.statics.findById = function(id) {
  return this.findOne({ _id : id});
};

golfPOISchema.statics.findByCategory = function(categoryId) {
  return this.find({ category : categoryId});
};

module.exports = Mongoose.model("GolfPOI", golfPOISchema);
