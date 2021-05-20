'use strict';

const LocationCategory = require('../models/locationCategory');
const Boom = require("@hapi/boom");

const LocationCategories = {

  //---------------------------------------------------------------------------------------------------------------
  // find method in LocationCategories API. This will return all Categories found. I.e all provinces courses.
  //---------------------------------------------------------------------------------------------------------------
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const allCategories = await LocationCategory.find().populate("lastUpdatedBy").lean();
      return (allCategories);
    },
  },

  //---------------------------------------------------------------------------------------------------------------
  // findOne method in LocationCategories API. This will return a Category (province) based on id
  //---------------------------------------------------------------------------------------------------------------
  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const category = await LocationCategory.findOne({ _id: request.params.id });
        if (!category) {
          return Boom.notFound("No Category with this id");
        }
        return category;
      } catch (err) {
        return Boom.notFound("No Category with this id");
      }
    },
  },

  //---------------------------------------------------------------------------------------------------------------
  // create method in LocationCategories API. This will create a new location Category in DB. Takes in
  // locationCategory object in payload.
  //---------------------------------------------------------------------------------------------------------------
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const newCategory = new LocationCategory(request.payload);
      const category = await newCategory.save();
      if (category) {
        return h.response(category).code(201);
      }
      return Boom.badImplementation("error creating new category");
    }
  },

  //---------------------------------------------------------------------------------------------------------------
  // deleteOne method in LocationCategories API. This will delete a single location Category based on id.
  //---------------------------------------------------------------------------------------------------------------
  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const response = await LocationCategory.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  //---------------------------------------------------------------------------------------------------------------
  // deleteOne method in LocationCategories API. This will delete all location Categories Use with care!
  //---------------------------------------------------------------------------------------------------------------
  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await LocationCategory.remove({});
      return { success: true };
    },
  },

};

module.exports = LocationCategories;