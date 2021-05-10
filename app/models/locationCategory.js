"use strict";

const Mongoose = require("mongoose");
const Boom = require("@hapi/boom");
const Schema = Mongoose.Schema;

const locationCategorySchema = new Schema({
  province: String,
  validCounties: [String],
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

locationCategorySchema.statics.findById = function(id) {
  return this.findOne({ _id: id });
}

locationCategorySchema.statics.findByProvince = function(province) {
  return this.findOne({ province : province});
};

locationCategorySchema.methods.checkValidCounty = function(countyToCheck) {
  const isFound = this.validCounties.includes(countyToCheck);
  return isFound;
};

module.exports = Mongoose.model("LocationCategory", locationCategorySchema);
