const Joi = require("joi");

// CREATE USER - password مطلوب
const createUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age: Joi.number().required(),
  password: Joi.string().min(6).required(), // هنا مطلوب
});

// UPDATE USER PUT - كل الحقول مطلوبة، بما فيها password
const updateUserPutSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age: Joi.number().required(),
  password: Joi.string().min(6).required(), // لو عايزة تعديل password
});

// UPDATE USER PATCH - كل الحقول optional
const updateUserSchema = Joi.object({
  name: Joi.string().min(3).optional(),
  email: Joi.string().email().optional(),
  age: Joi.number().optional(),
  password: Joi.string().min(6).optional(), // لو عايزة تعديل password
});

module.exports = {
  createUserSchema,
  updateUserPutSchema,
  updateUserSchema,
};
