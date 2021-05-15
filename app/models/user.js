"use strict";

const Mongoose = require("mongoose");
const Boom = require("@hapi/boom");
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt');          //bcrypt module for salting and Hashing

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  adminUser: Boolean,
  loginCount: Number,
  lastLoginDate: String
});

userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email : email});
};

userSchema.methods.comparePassword = async function(candidatePassword) {    // change to Async
  const isMatch = await bcrypt.compare(candidatePassword, this.password);   // Use bcrypt compare function
  if (!isMatch) {
    throw Boom.unauthorized('Password mismatch');
  }
  return this;
};

module.exports = Mongoose.model("User", userSchema);
