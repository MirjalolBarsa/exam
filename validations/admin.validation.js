import Joi from "joi";

export const createAdminValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(4).max(30).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string()
      .pattern(/^\+998\d{9}$/)
      .required()
      .messages({
        "string.pattern.base":
          "Telefon raqam +998 bilan boshlanib, 9 ta raqam bo‘lishi kerak",
      }),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,?/\\\-])[A-Za-z\d!@#$%^&*.,?/\\\-]{8,20}$/
      )
      .required()
      .messages({
        "string.pattern.base":
          `Parol kamida 8 ta belgidan iborat bo‘lishi, katta harf, kichik harf, raqam va belgi o‘z ichiga olishi kerak`,
      }),
    role: Joi.string().valid("admin", "superadmin").optional(),
  });

  return schema.validate(data, { abortEarly: false });
};

export const signInAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).required(),
    password: Joi.string().required(),
  });
  return admin.validate(data);
};

export const updateAdminValidator = (data) => {
  const admin = Joi.object({
    username: Joi.string().min(4).optional(),
    password: Joi.string()
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,?/\\\-])[A-Za-z\d!@#$%^&*.,?/\\\-]{8,20}$/
      )
      .optional(),
  });
  return admin.validate(data);
};
