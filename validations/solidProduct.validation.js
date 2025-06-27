import Joi from "joi";

export const createSolidProductValidator = (data) => {
  const solid = Joi.object({
    productId: Joi.string().required(),
    clentId: Joi.string().required(),
  });
  return solid.validate(data);
};

export const updateSolidProductValidator = (data) => {
  const solid = Joi.object({
    productId: Joi.string().optional(),
    clentid: Joi.string().optional(),
    quantity: Joi.number().optional(),
    totalPrice: Joi.number().optional(),
  });
  return solid.validate(data);
};
