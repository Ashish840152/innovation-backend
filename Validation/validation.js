const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  mobile: Joi.string().required(),
  address: Joi.string().required(),
  password: Joi.string().required(),
  role: Joi.string(),
  teamLead: Joi.optional()
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required()
})

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.number().required(),
})

const notificationSchema = Joi.object({
  user_id: Joi.required(),
  title: Joi.string().required()
})

const connectionSchema = Joi.object({
  user_id: Joi.required(),
  device_id: Joi.string().required(),
})

module.exports = {
    userRegistrationSchema,
    userLoginSchema,
    changePasswordSchema,
    otpSchema,
    notificationSchema,
    connectionSchema
  };
  