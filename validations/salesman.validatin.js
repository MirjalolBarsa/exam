import Joi from "joi";

export const createSalesmanValidator = (data) => {
  const salesman = Joi.object({
    username: Joi.string().min(4).required(),
    fullName: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string()
      .regex(/^\+998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/)
      .required(),
    password: Joi.string().required(),
  });
  return salesman.validate(data);
};

export const signUpSalesmanValidator = (data) => {
  const customer = Joi.object({
    phoneNumber: Joi.string()
      .regex(/^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/)
      .required(),
    email: Joi.string().email().required(),
  });
  return customer.validate(data);
};

export const signInSalesmanValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string().required(),
  });
  return customer.validate(data);
};

export const confirmSignInSalesmanValidator = (data) => {
  const customer = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  });
  return customer.validate(data);
};

export const updateSalesmanValidator = (data) => {
  const customer = Joi.object({
    username: Joi.string().min(4).required(),
    fullName: Joi.string().required().optional(),
    address: Joi.string().required().optional(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string()
      .regex(/^\+998[-\s]?\(?\d{2}\)?[-\s]?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/)
      .required(),
    password: Joi.string().required().optional(),
  });
  return customer.validate(data);
};
