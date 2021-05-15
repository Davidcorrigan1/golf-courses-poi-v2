'use strict';

const User = require('../models/user');
const Boom = require("@hapi/boom");
const utils = require('./utils.js');
const bcrypt = require("bcrypt");          //bcrypt package use for salt and hashing
const saltRounds = 10;                     //Setting to 10 to slow hashing.

const Users = {
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        } else {
          const isMatch = await bcrypt.compare(request.payload.password, user.password);
          if (!isMatch) {
            return Boom.unauthorized("Invalid password");
          } else {
            const token = utils.createToken(user);
            return h.response({ success: true, token: token }).code(201);
          }
        }
      } catch (err) {
        return Boom.notFound("internal db failure");
      }
    },
  },

  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const allUsers = await User.find().lean();
      return (allUsers);
    },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
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

  findByEmail: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await User.findByEmail(request.params.email);
        if (!user) {
          return Boom.notFound("No User with this email");
        }
        return user;
      } catch (err) {
        return Boom.notFound("No User with this email");
      }
    },
  },

  create: {
    auth: false,
    handler: async function (request, h) {
      const payload = request.payload;

      let existingUser = await User.findByEmail(payload.email);
      if (existingUser) {
        const message = "Email address is already registered";
        throw Boom.badData(message);
      }

      const hash = await bcrypt.hash(payload.password, saltRounds);

      const newUser = new User({firstName: payload.firstName,
                                lastName: payload.lastName,
                                email: payload.email,
                                password: hash,
                                adminUser: payload.adminUser,
                                loginCount: payload.loginCount,
                                lastLoginDate: payload.lastLoginDate});

      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation("error creating new user");
    }
  },

  update: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        if (user.password !== request.payload.password) {                             //check password change
          user.password = await bcrypt.hash(request.payload.password, saltRounds);    //Salt and Hash password Updates password.                                         // Assignment - Storing hash value
        }
        user.firstName = request.payload.firstName;
        user.lastName = request.payload.lastName;
        user.email = request.payload.email;
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
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const response = await User.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound("id not found");
    },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      await User.remove({});
      return { success: true };
    },
  },

};

module.exports = Users;