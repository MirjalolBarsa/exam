import Joi from "joi";

export const createProductValidator = (data) => {
  const product = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
    quantity: Joi.string().required(),
    color: Joi.string().required(),
    categoryId: Joi.string().required(),
    salesmanId: Joi.string().required(),
  });
  return product.validate(data);
};

export const updateProductValidator = (data) => {
  const product = Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    price: Joi.number().optional(),
    quantity: Joi.number().optional(),
    color: Joi.string().optional(),
    categoryId: Joi.string().optional(),
    salesmanId: Joi.string().optional(),
  });
  return product.validate(data);
};
