"use strict";

const Joi = require('@hapi/joi');
const GolfPOI = require("../models/golfPOI");
const User = require("../models/user");
const LocationCategory = require("../models/locationCategory");
const ImageStore = require("../utils/imageStore");
const Boom = require("@hapi/boom");

const AdminFunction = {
  //----------------------------------------------------------------------------------------
  // This method will retrieve the list of location categories and pass these to the
  // 'newCourse' view. This view allows the user to add a new POI Golf course.
  //----------------------------------------------------------------------------------------
  manageUsers: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);


      let userArray = [];

      if (user.adminUser) {
        const allUsers = await User.find().lean();
        for (let i=0; i < allUsers.length; i++) {
          if (!allUsers[i].adminUser) {
            userArray.push(allUsers[i]);
          }
        }
        const adminUser = user.adminUser;

        const golfCourses = await GolfPOI.find().populate("lastUpdatedBy").populate("category").lean();
        const courseCount = golfCourses.length;

        return h.view("manageUsers", {
            title: "Golf Courses of Ireland",
            subTitle: "Manage User Accounts",
            userArray: userArray,
            adminUser: adminUser,
            courseCount: courseCount
        });
      } else {
        const message = "User is not Authorised";
        throw Boom.unauthorized(message);
      };

    },
  },

  //--------------------------------------------------------------------------------------------
  // This is an Admin User method which will delete a selected user from the User collection.
  //--------------------------------------------------------------------------------------------
  deleteUser: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id;
      const user = await User.findById(id);

      if (user.adminUser) {
        const userId = request.params.id;

        const deleteUser = await User.findByIdAndDelete(userId).lean();

        return h.redirect("/manageUsers");
      } else {
        const message = "User is not Authorised";
        throw Boom.unauthorized(message);
      };
    },
  },
  //--------------------------------------------------------------------------------------------
  // This is an Admin User method which will display a selected user from the User collection
  // for update.
  //--------------------------------------------------------------------------------------------
  displayUser: {
    handler: async function(request, h) {
      const id = request.auth.credentials.id;
      const loggedOnUser = await User.findById(id).lean();
      const adminUser = loggedOnUser.adminUser;

      if (adminUser) {
        const userId = request.params.id;

        const displayUser = await User.findById(userId).lean();


        return h.view("displayUser", {
          title: "Golf Courses of Ireland",
          subTitle: "Update User details here",
          user: displayUser,
          adminUser: adminUser,
        });
      } else {
        const message = "User is not Authorised";
        throw Boom.unauthorized(message);
      };
    },
  },
  //----------------------------------------------------------------------------------------------
  // This method will update the users details from an Admin account. It checks for an Admin
  // account before any updates happen.
  //----------------------------------------------------------------------------------------------
  updateUser: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
          .view("displayUser", {
            title: "User update error",
            errors: error.details,
          })
          .takeover()
          .code(400);
      },
    },
    handler: async function(request, h) {
      try {
        const updatedUser = request.payload;
        const id = request.auth.credentials.id;
        const loggedOnUser = await User.findById(id);

        const adminUser = loggedOnUser.adminUser;

        let editUser;
        if (adminUser) {
          const editUserId = request.params.id;
          editUser = await User.findById(editUserId);
          editUser.firstName = updatedUser.firstName;
          editUser.lastName = updatedUser.lastName;
          editUser.email = updatedUser.email;
          editUser.password = updatedUser.password;
          await editUser.save();
          return h.redirect("/manageUsers");
        } else
        {
          return h.redirect("/displayUser" + editUser._id)
        };
      } catch (err) {
        return h.view("main", {errors: [{message: err.message}]});
      };
    }
  },
};

module.exports = AdminFunction;