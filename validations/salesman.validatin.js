import Joi from "joi";

export const createSalesmanValidator = (data) => {
  const salesman = Joi.object({
    username: Joi.string().min(4).required(),
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().regex(/^\+99\d{7,12}$/),
    address: Joi.string().required(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9]+@gmail.com$/)
      .required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .required(),
  });
  return salesman.validate(data);
};
export const signinSalesmanValidator = (data) => {
  const salesman = Joi.object({
    email: Joi.string()
      .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
      .required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .required(),
  });
  return salesman.validate(data);
};

export const updateSalesmanValidator = (data) => {
  const salesman = Joi.object({
    username: Joi.string().min(4).optional(),
    fullName: Joi.string().optional(),
    phoneNumber: Joi.string().regex(/^\+99\d{7,12}$/),
    address: Joi.string().optional(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
      .optional(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .optional(),
  });
  return salesman.validate(data);
};
