'use strict';

const User = require('../models/user');
const Boom = require("@hapi/boom");
const utils = require('./utils.js');

const Users = {
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized("User not found");
        } else if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        } else {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  find: {
    auth: false,
    handler: async function (request, h) {
      const allUsers = await User.find().lean();
      return (allUsers);
    },
  },

  findOne: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No User with this id");
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      const newUser = new User(request.payload);
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating new user");
    }
  },

  update: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        user.firstName = request.payload.firstName;
        user.lastName = request.payload.lastName;
        user.email = request.payload.email;
        user.password = request.payload.password;
        user.loginCount = request.payload.loginCount;
        user.lastLoginDate = request.payload.lastLoginDate;
        const updatedUser = await user.save();
        if (updatedUser) {
          return h.response(updatedUser).code(201);
        }
        return Boom.badImplementation("error updating user1");
      } catch (e) {
        return Boom.badImplementation("Error Updating user2" + e);
      }
    }
  },

  deleteOne: {
    auth: false,
    handler: async function (request, h) {
      const response = await User.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  deleteAll: {
    auth: false,
    handler: async function (request, h) {
      await User.remove({});
      return { success: true };
    },
  },

};

module.exports = Users;