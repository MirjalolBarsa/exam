import Joi from "joi";

export const createCategoryValidator = (data) => {
  const category = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow(""),
  });
  return category.validate(data);
};

export const updateCategoryValidator = (data) => {
  const category = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow("").optional(),
  });
  return category.validate(data);
};
