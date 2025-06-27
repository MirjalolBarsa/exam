import Joi from "joi";

export const createAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
      .required(),
    phone: Joi.string()
      .regex(/^\+99\d{7,12}$/)
      .required(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .required(),
  });
  return admin.validate(data);
};

export const signinAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
      .required(),
  });
  return admin.validate(data);
};
export const confirmSigninAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
      .required(),
    otp: Joi.string().length(6).required(),
  });
  return admin.validate(data);
};

export const updateAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().optional(),
    email: Joi.string()
      .regex(/^[a-zA-Z0-9]+@gmail\.com$/)
      .optional(),
    phone: Joi.string()
      .regex(/^\+99\d{7,12}$/)
      .optional(),
    password: Joi.string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
      )
      .optional(),
  });
  return admin.validate(data);
};
