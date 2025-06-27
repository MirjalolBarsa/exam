import Joi from "joi";

export const creatClentValidator = (data) => {
  const clent = Joi.object({
    name: Joi.string().required(),
    phoneNumber: Joi.string()
      .regex(/^\+99\d{7,12}$/)
      .required(),
    address: Joi.string().required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .required(),
  });
  return clent.validate(data);
};
export const signinClentValidator = (data) => {
  const clent = Joi.object({
    phoneNumber: Joi.string()
      .regex(/^\+99\d{7,12}$/)
      .required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .required(),
  });
  return clent.validate(data);
};
export const updateClentValidator = (data) => {
  const clent = Joi.object({
    name: Joi.string().optional(),
    phoneNumber: Joi.string()
      .regex(/^\+99\d{7,12}$/)
      .optional(),
    address: Joi.string().optional(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .optional(),
  });
  return clent.validate(data);
};
