'use strict';

const Joi = require('@hapi/joi');
const User = require('../models/user');
const CreateUserSchema = require('../validation/createPOISchema');
const UpdateUserSchema = require('../validation/updateUserSchema');
const Boom = require("@hapi/boom");
const utils = require('./utils.js');
const bcrypt = require("bcrypt");          //bcrypt package use for salt and hashing
const saltRounds = 10;                     //Setting to 10 to slow hashing.



const Users = {

  //---------------------------------------------------------------------------------------------------------------
  // authenticate method in Users API. This will authenticate a user based on email and password. If details
  // match then a JWT token is created and passed back.
  //---------------------------------------------------------------------------------------------------------------
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

  //---------------------------------------------------------------------------------------------------------------
  // find method in Users API. This will return all the users on the DB.
  //---------------------------------------------------------------------------------------------------------------
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      const allUsers = await User.find().lean();
      return (allUsers);
    },
  },

  //---------------------------------------------------------------------------------------------------------------
  // findOne method in Users API. This will return a specific user on the DB by id.
  //---------------------------------------------------------------------------------------------------------------
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

  //---------------------------------------------------------------------------------------------------------------
  // findByEmail method in Users API. This will return a specific user on the DB by email Address.
  //---------------------------------------------------------------------------------------------------------------
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

  //-----------------------------------------------------------------------------------------------
  // The create method will create a new user based on the user object passed.
  // 1) It will validate the user input based on the createUserSchema rules set up.
  // 2) Check the email address doesn't exist
  // 3) Hash and salt the password
  // 4) Create a new user object and save it to the collection.
  //-----------------------------------------------------------------------------------------------
  create: {
    auth: false,
    handler: async function (request, h) {

      try {
        await CreateUserSchema.validateAsync(request.payload, {abortEarly: false});
      } catch (error) {
        let message = error.details[0].message;
        return Boom.badRequest(message);
      }

      const payload = request.payload;

      let existingUser = await User.findByEmail(payload.email);
      if (existingUser) {
        const message = "Email address is already registered";
        return Boom.badRequest(message);
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

  //-----------------------------------------------------------------------------------------------
  // The update method will create a update user based on the userid and object passed.
  // 1) It will first find the user and retrieve current details
  // 2) It will then validate the user input based on the UpdateUserSchema rules set up.
  // 3) Checks if the password has been updated. if it has then hash it using bcrypt
  // 4) Create a update user object and save it to the collection.
  //-----------------------------------------------------------------------------------------------
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

        try {
          await UpdateUserSchema.validateAsync(request.payload, {abortEarly: false});
        } catch (error) {
          let message = error.details[0].message;
          return Boom.badRequest(message);
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

  //---------------------------------------------------------------------------------------------------------------
  // deleteOne method in Users API. This will delete a specific user on the DB by id.
  //---------------------------------------------------------------------------------------------------------------
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

  //---------------------------------------------------------------------------------------------------------------
  // deleteAll method in Users API. This will delete all users on the DB by id.
  //---------------------------------------------------------------------------------------------------------------
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