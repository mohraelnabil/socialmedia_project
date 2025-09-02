// utilts/validarion/post.js
const Joi = require("joi");

// Create Post Schema
const createPostSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(10).required(),
  user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // ObjectId validation
});

// PUT Update Schema
const updatePostPutSchema = Joi.object({
  title: Joi.string().min(3).required(),
  content: Joi.string().min(10).required(),
  user: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(),
});

// PATCH Update Schema (all optional)
const updatePostSchema = createPostSchema.fork(
  ["title", "content", "user"],
  (schema) => schema.optional()
);

module.exports = {
  createPostSchema,
  updatePostPutSchema,
  updatePostSchema,
};
