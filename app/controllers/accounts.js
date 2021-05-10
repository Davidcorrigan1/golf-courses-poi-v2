"use strict";
const User = require("../models/user");
const GolfPOI = require("../models/golfPOI");
const Boom = require("@hapi/boom");
const Joi = require('@hapi/joi');

const Accounts = {
  //----------------------------------------------------------------------------------------------
  // This method displays the 'main' view.
  //----------------------------------------------------------------------------------------------
  index: {
    auth: false,
    handler: function(request, h) {
      return h.view("main", {
        title: "Golf Courses of Ireland",
        subTitle: "Please sign up or login"
      });
    }
  },

  //----------------------------------------------------------------------------------------------
  // This method displays the 'signup' view.
  //----------------------------------------------------------------------------------------------
  showSignup: {
    auth: false,
    handler: function(request, h) {
      return h.view("signup", {
        title: "Golf Courses of Ireland",
        subTitle: "Sign up for you account here"
      });
    }
  },

  //----------------------------------------------------------------------------------------------
  // This method processes the 'signup' view. It firstly validate the data in the payload.
  // It then checks the passed in email is not already registered. If it's not then it
  // creates a user object with the data passed in for the view. It then saves the user
  // object to the user collection and requests a cookie to be created with the id from the
  // user just created. This will be used to authenticate the user on the other views.
  //----------------------------------------------------------------------------------------------
  signup: {
    auth: false,
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        adminUser: Joi.boolean().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
            .view("signup", {
              title: "Sign up error",
              errors: error.details,
            })
            .takeover()
            .code(400);
      },
    },
    handler: async function(request, h) {
      try {
        const payload = request.payload;
        let user = await User.findByEmail(payload.email);
        if (user) {
          const message = "Email address is already registered";
          throw Boom.badData(message);
        }

        const currentDate = new Date().toISOString().slice(0,10);
        console.log("Date: " + currentDate);

        const newUser = new User({
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          password: payload.password,
          adminUser: payload.adminUser,
          loginCount: 1,
          lastLoginDate: currentDate
        });
        user = await newUser.save();
        request.cookieAuth.set({ id: user.id });
        return h.redirect("/report");
      } catch (err) {
        return h.view("signup", { errors: [{ message: err.message }] });
      }
    }
  },

  //----------------------------------------------------------------------------------------------
  // This method displays the 'login' view.
  //----------------------------------------------------------------------------------------------
  showLogin: {
    auth: false,
    handler: function(request, h) {
      return h.view("login", {
        title: "Golf Courses of Ireland",
        subTitle: "Login to your account here"
      });
    }
  },

  //----------------------------------------------------------------------------------------------
  // This method processes the 'logon' view. It firstly validate the data in the payload.
  // It then checks the passed in email is registered. If it is then it
  // checks the payload password against the password on the user collection for the user.
  // If the passwords match it requests a cookie to be created with the id from the
  // user just created. This will be used to authenticate the user on the other views.
  //----------------------------------------------------------------------------------------------
  login: {
    auth: false,
    validate: {
      payload: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
            .view("login", {
              title: "Sign in error",
              errors: error.details,
            })
            .takeover()
            .code(400);
      },
    },
    handler: async function(request, h) {
      const { email, password } = request.payload;
      try {
        let user = await User.findByEmail(email);
        if (!user) {
          const message = "Email address is not registered";
          throw Boom.unauthorized(message);
        }
        user.comparePassword(password);
        request.cookieAuth.set({ id: user.id });

        const currentDate = new Date().toISOString().slice(0,10);
        user.lastLoginDate = currentDate;
        user.loginCount += 1;
        user.save();

        return h.redirect("/report");
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },

  //----------------------------------------------------------------------------------------------
  // This method logs the user out by clear the cookie and redirects the 'main' view.
  //----------------------------------------------------------------------------------------------
  logout: {
    handler: function(request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    }
  },

  //----------------------------------------------------------------------------------------------
  // This method displays the 'settings' view. Firstly it authenticates the user and retrieves
  // the user data from the collection. It then calls the view passing the current user date to it.
  //----------------------------------------------------------------------------------------------
  showSettings: {
    handler: async function(request, h) {
      try {
        const id = request.auth.credentials.id;
        const user = await User.findById(id).lean();

        const golfCourses = await GolfPOI.find().populate("lastUpdatedBy").populate("category").lean();
        const courseCount = golfCourses.length;

        return h.view("settings", {
          title: "Golf Courses of Ireland",
          subTitle: "Sign up for you account here",
          user: user,
          adminUser: user.adminUser,
          courseCount: courseCount
        });
      } catch (err) {
        return h.view("login", { errors: [{ message: err.message }] });
      }
    }
  },

  //----------------------------------------------------------------------------------------------
  // This method processes the 'settings' view. It firstly authenticates the user and retrieves
  // the user data. It then updates the current user data with the updates passed in the payload.
  // It then saves this data to the user collection and redisplays the 'settings' view.
  //----------------------------------------------------------------------------------------------
  updateSettings: {
    validate: {
      payload: {
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      },
      options: {
        abortEarly: false,
      },
      failAction: function (request, h, error) {
        return h
            .view("settings", {
              title: "Sign up error",
              errors: error.details,
            })
            .takeover()
            .code(400);
      },
    },
    handler: async function(request, h) {
      try {
        const userEdit = request.payload;
        const id = request.auth.credentials.id;
        const user = await User.findById(id);
        user.firstName = userEdit.firstName;
        user.lastName = userEdit.lastName;
        user.email = userEdit.email;
        user.password = userEdit.password;
        await user.save();
        return h.redirect("/settings");
      } catch (err) {
        return h.view("main", {errors: [{message: err.message}]});
      }
    }
  }
};

module.exports = Accounts;
