'use strict';

const Joi = require('@hapi/joi');

const UpdateUserSchema = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .regex(/^[A-Z][A-Za-z-\s'0-9]{1,40}$/)
    .message('First Name must start with a capital, must only contain letters, numbers and - or \' or space and must be between 1 and 40 in length '),
  lastName:  Joi.string()
    .required()
    .regex(/^[A-Z][A-Za-z-\s0-9']{1,40}$/)
    .message('Last Name must start with a capital, must only contain letters, numbers and - or \' or space and must be between 1 and 40 in length '),
  email: Joi.string().email().required(),
  adminUser: Joi.boolean(),
  loginCount: Joi.required(),
  lastLoginDate: Joi.required(),
  password: Joi.required(),
  __v: Joi.number(),
  _id: Joi.string()

});

module.exports = UpdateUserSchema;