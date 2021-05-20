'use strict';

const Joi = require('@hapi/joi');

const CreatePOISchema = Joi.object().keys({
  _id: Joi.optional(),
  courseName: Joi.string()
    .required()
    .regex(/^[A-Z][A-Za-z-\s'0-9,"’`.\r\n]{1,100}$/)
    .message('Course Name must start with a capital, must only contain letters, numbers and - \' ,’` . or space and must be between 1 and 100 in length '),
  courseDesc:  Joi.string()
    .required()
    .regex(/^[A-Z][A-Za-z-\s0-9,"’`.\r\n']{10,}$/)
    .message('Course Description must start with a capital, must only contain letters, numbers and - \'` ,’ . or space and must be at least 10 in length '),
  lastUpdatedBy: Joi.optional(),
  category: Joi.optional(),
  relatedImages: Joi.required(),
  location: Joi.object().keys({
    type: Joi.string().required().valid("Point"),
    coordinates: Joi.array().items(
      Joi.number().min(-90).max(90).required(),
      Joi.number().min(-180).max(180).required(),
    )
  })
});

module.exports = CreatePOISchema;