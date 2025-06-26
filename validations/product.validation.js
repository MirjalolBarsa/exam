import Joi from "joi";

export const createProductValidator = (data) => {
  const product = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow(""),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(0).required(),
    color: Joi.string().trim().required(),
    salesmanId: Joi.string().required(),
    categoryId: Joi.string().required(),
  });
  return product.validate(data);
};

export const updateProductValidator = (data) => {
  const product = Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().trim().allow("").optional(),
    price: Joi.number().min(0).required().optional(),
    quantity: Joi.number().integer().min(0).required().optional(),
    color: Joi.string().trim().required().optional(),
    salesmanId: Joi.string().required().optional(),
    categoryId: Joi.string().required().optional(),
  });
  return product.validate(data);
};
