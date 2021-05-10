'use strict';

const LocationCategory = require('../models/locationCategory');
const Boom = require("@hapi/boom");

const LocationCategories = {
  find: {
    auth: false,
    handler: async function (request, h) {
      const allCategories = await LocationCategory.find().populate("lastUpdatedBy").lean();
      return (allCategories);
    },
  },

  findOne: {
    auth: false,
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

  create: {
    auth: false,
    handler: async function (request, h) {
      const newCategory = new LocationCategory(request.payload);
      const category = await newCategory.save();
      if (category) {
        return h.response(category).code(201);
      }
      return Boom.badImplementation("error creating new category");
    }
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      const response = await LocationCategory.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await LocationCategory.remove({});
      return { success: true };
    },
  },

};

module.exports = LocationCategories;