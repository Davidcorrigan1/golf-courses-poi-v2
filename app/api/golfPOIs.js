'use strict';

const GolfPOI = require('../models/golfPOI');
const LocationCategory = require('../models/locationCategory');
const CreatePOISchema = require('../validation/createPOISchema');
const UpdatePOISchema = require('../validation/updatePOISchema');
const sanitizeHtml = require('sanitize-html');
const User = require('../models/user');
const Boom = require("@hapi/boom");
const ImageStore = require("../utils/imageStore");

const GolfPOIs = {

  //---------------------------------------------------------------------------------------------------------------
  // find method in golfPOI API. This will return all golfPOIs found. I.e all golf courses.
  //---------------------------------------------------------------------------------------------------------------
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

  //---------------------------------------------------------------------------------------------------------------
  // findOne method in golfPOI API. This will return a specific golfPOI found based on the id.
  //---------------------------------------------------------------------------------------------------------------
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

  //----------------------------------------------------------------------------------------------------
  // This findByCategory method will retrieve all the courses from the GolfPOI collection for a specific category.
  // And it will pass these to the 'reportCategory' view to display them.
  // It also passes the adminUser the 'report' view so it can decide what options to show.
  //----------------------------------------------------------------------------------------------------
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

  //---------------------------------------------------------------------------------------------------------------
  // update method in golfPOI API. This will update a specific course based on courseId and courseObject.
  // 1) Find the user for the Id passed
  // 2) Find the course for the courseId Passed
  // 3) Sanitize the name and description to remove html tags and attributes
  // 4) Validate input based on rules
  // 5) Find the related id of the category selected
  // 6) Update the POI object and save to collection.
  //---------------------------------------------------------------------------------------------------------------
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

        // Sanitize the course name and description
        request.payload.courseName = sanitizeHtml(request.payload.courseName,{  allowedTags: [],
          allowedAttributes: []});
        request.payload.courseDesc = sanitizeHtml(request.payload.courseDesc,{  allowedTags: [],
          allowedAttributes: []});

        // Validate the update course input
        try {
          await UpdatePOISchema.validateAsync(request.payload, {abortEarly: false});
        } catch (error) {
          let message = error.details[0].message;
          console.log(error.details[0].message);
          return Boom.badRequest(message);
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
        await course.save()

        return h.response(course).code(201);

      } catch (err) {
        return Boom.notFound("Could not update Course" + err);
      }
    }
  },

  //---------------------------------------------------------------------------------------------------------------
  // create method in golfPOI API. This will create a new course.
  // The course name and desc are sanitize using Sanitize-html to remove all tags/attributes
  // The payload fields are validated using Joi and and rules in CreatePOISchema
  //---------------------------------------------------------------------------------------------------------------
  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {

        // Sanitize the course name and description
        request.payload.courseName = sanitizeHtml(request.payload.courseName,{  allowedTags: [],
          allowedAttributes: []});
        request.payload.courseDesc = sanitizeHtml(request.payload.courseDesc,{  allowedTags: [],
          allowedAttributes: []});

        // Validate the user input and return a message if a problem
        try {
          await CreatePOISchema.validateAsync(request.payload, {abortEarly: false});
        } catch (error) {
          let message = error.details[0].message;
          console.log(error.details[0].message);
          return Boom.badRequest(message);
        }

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

  //---------------------------------------------------------------------------------------------------------------
  // uploadImage method in golfPOI API. This will save a new image pass in the payload to Cloudinary using the
  // ImageStore utility. Then the public_id of the image is added to the course related images array and the
  // course details are saved to the DB collection.
  //---------------------------------------------------------------------------------------------------------------
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

  //---------------------------------------------------------------------------------------------------------------
  // deleteImage method in golfPOI API. This will take in the public_id of an image and delete it from
  // Cloudinary. It will then retrieve the course using the courseId passed in and remove the public_id from the
  // array of relatedImages and save the course back to the DB collection.
  //---------------------------------------------------------------------------------------------------------------
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
        golfPOI.lastUpdatedBy = request.params.userId;
        await golfPOI.save();

        return (golfPOI);

      } catch (err) {
        return Boom.badImplementation("error Deleting Image to golfPOI");
      }
    }
  },

  //---------------------------------------------------------------------------------------------------------------
  // deleteOne method in golfPOI API. This will delete a specific course using the courseId passed in.
  //---------------------------------------------------------------------------------------------------------------
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

  //---------------------------------------------------------------------------------------------------------------
  // deleteAll method in golfPOI API. This will delete all courses. (Use with care!!).
  //---------------------------------------------------------------------------------------------------------------
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