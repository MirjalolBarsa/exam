import Joi from "joi";

export const createSoldProductValidator = (data) => {
  const soldProduct = Joi.object({
    product_Id: Joi.string().required(),
    client_id: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    total_price: Joi.number().min(0).required(),
  });
  return soldProduct.validate(data);
};

export const updateSoldProductValidator = (data) => {
  const soldProduct = Joi.object({
    product_Id: Joi.string().required(),
    client_id: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    total_price: Joi.number().min(0).required(),
  });
  return soldProduct.validate(data);
};
