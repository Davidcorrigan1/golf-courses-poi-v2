'use strict';

const GolfPOI = require('../models/golfPOI');
const LocationCategory = require('../models/locationCategory');
const User = require('../models/user');
const Boom = require("@hapi/boom");
const ImageStore = require("../utils/imageStore");

const GolfPOIs = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const golfPOI = await GolfPOI.find().populate("lastUpdatedBy").populate("category").lean();
        return (golfPOI);
      } catch (e) {
        return Boom.badImplementation("error finding golfPOIs");
      }
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const golfPOI = await GolfPOI.findOne({ _id: request.params.id });
        if (!golfPOI) {
          return Boom.notFound("No GolfPOI with this id");
        }
        return golfPOI;
      } catch (err) {
        return Boom.notFound("No GolfPOI with this id");
      }
    },
  },

  //----------------------------------------------------------------------------------------
  // This method will retrieve all the courses from the GolfPOI collection for a specific category.
  // And it will pass these to the 'reportCategory' view to display them.
  // It also passes the adminUser the 'report' view so it can decide what options to show.
  //----------------------------------------------------------------------------------------
  findByCategory: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {

        const categoryId = request.params.categoryId;
        const golfCourses = await GolfPOI.findByCategory(categoryId).populate("lastUpdatedBy").populate("category").lean();

        if (!golfCourses) {
          return Boom.notFound("No GolfPOI for this category");
        }
        return golfCourses;
      } catch (err) {
        return Boom.notFound("No GolfPOI for this category");
      }
    },
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const courseEdit = request.payload;
        const id = request.params.id;
        const user = await User.findById(id);
        if (!user) {
          return Boom.notFound("Update GolfPOI: No User with this user id");
        }

        const courseId = request.params.courseId;
        const course = await GolfPOI.findById(courseId).populate("lastUpdatedBy").populate("category");
        if (!course) {
          return Boom.notFound("Update GolfPOI: No GolfPOI with this course id");
        }

        // From the category picked it finds the related id.
        if ((!course.category) || (course.category !== courseEdit.category)) {
          let category = await LocationCategory.findById(courseEdit.category)
          if (!category) {
            return Boom.notFound("Update GolfPOI: No Province found");
          }
          course.category = category.id;
        }

        // Updates the course document
        course.courseName = courseEdit.courseName;
        course.courseDesc = courseEdit.courseDesc;
        course.lastUpdatedBy = user._id;

        course.location.coordinates = courseEdit.location.coordinates;
        course.relatedImages = courseEdit.relatedImages;

        await course.save()

        return h.response(course).code(201);

      } catch (err) {
        return Boom.notFound("Could not update Course" + err);
      }
    }
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const newGolfPOI = new GolfPOI(request.payload);
        const golfPOI = await newGolfPOI.save();
        if (golfPOI) {
          return h.response(golfPOI).code(201);
        }
        return Boom.badImplementation("error creating golfPOI");
      } catch {
        return Boom.badImplementation("error creating golfPOI");
      }
    }
  },

  uploadImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const file = request.payload.imagefile;
        const golfPOI = await GolfPOI.findOne({ _id: request.params.id });
        if (!golfPOI) {
          return Boom.notFound("No GolfPOI with this id");
        }
        if (Object.keys(file).length > 0) {
          const result = await ImageStore.uploadImage(request.payload.imagefile);
          golfPOI.relatedImages.push(result.public_id);
          let course = await golfPOI.save();
          return (course)
        } else {
          return Boom.notFound("No Image found to upload");
        }
      } catch (e) {
        return Boom.badImplementation("error adding Image to golfPOI");
      }
    }
  },

  deleteImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);

        // Retrieve the course document from the golfPOI collection.
        const golfPOI = await GolfPOI.findOne({ _id: request.params.courseId }).populate("lastUpdatedBy").populate("category");
        if (!golfPOI) {
          return Boom.notFound("No GolfPOI with this id");
        }

        // Find the array element matching the image id and remove from the relatedImages array
        // Then save the course document back to the collection.
        const elementId = golfPOI.relatedImages.indexOf(request.params.id);
        const removedItem = golfPOI.relatedImages.splice(elementId,1);
        await golfPOI.save();

        return (golfPOI);

      } catch (err) {
        console.log(err);
      }
    }
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const golfPOI = await GolfPOI.remove({ _id: request.params.id });
      if (golfPOI) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    }
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await GolfPOI.remove({});
      return { success: true };
    },
  },
};

module.exports = GolfPOIs;