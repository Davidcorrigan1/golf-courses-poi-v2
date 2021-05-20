'use strict';

const Joi = require('@hapi/joi');

const CreateUserSchema = Joi.object().keys({
  firstName: Joi.string()
    .required()
    .regex(/^[A-Z][A-Za-z-\s'’,.0-9]{1,40}$/)
    .message('First Name must start with a capital, must only contain letters, numbers and - \'’ , . or space and must be between 1 and 40 in length '),
  lastName:  Joi.string()
    .required()
    .regex(/^[A-Z][A-Za-z-\s'’,.0-9]{1,40}$/)
    .message('Last Name must start with a capital, must only contain letters, numbers and - \'’ , . or space and must be between 1 and 40 in length '),
  email: Joi.string().email().required(),
  password: Joi.string()
    .regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[#?!@$%^&*-]).{8,30}$/)
    .message('Password must contain at least one of each: Upper case letter, lower case, number, special character, and must be between 8 and 30 in length'),
  adminUser: Joi.boolean().required(),
  loginCount: Joi.required(),
  lastLoginDate: Joi.required()

});

module.exports = CreateUserSchema;