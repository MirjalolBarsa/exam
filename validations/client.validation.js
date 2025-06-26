import Joi from "joi";

// 📱 O'zbek raqam formatiga mos regex
const uzPhoneRegex =
  /^\+998\s?(9[012345789]|3[3]|7[1])\s?\d{3}\s?\d{2}\s?\d{2}$/;

// 🔐 1. Clientni ro'yxatdan o'tkazish (Sign Up)
export const signUpClientValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    phoneNumber: Joi.string().pattern(uzPhoneRegex).required(),
    address: Joi.string().trim().min(5).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

// 🔐 2. Client tizimga kirishi (Sign In - 1-qadam)
export const signInClientValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data, { abortEarly: false });
};

// 🔐 3. OTP orqali tasdiqlash (Sign In - 2-qadam)
export const confirmSignInClientValidator = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().length(6).required(),
  });
  return schema.validate(data, { abortEarly: false });
};

// ✏️ 4. Client ma'lumotlarini yangilash (Update)
export const updateClientValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).optional(),
    phoneNumber: Joi.string().pattern(uzPhoneRegex).optional(),
    address: Joi.string().trim().optional(),
    password: Joi.string().min(6).optional(),
  });
  return schema.validate(data, { abortEarly: false });
};

// ➕ 5. Admin orqali yangi client yaratish (Create - CRUD uchun)
export const createClientValidator = (data) => {
  const schema = Joi.object({
    name: Joi.string().trim().min(3).max(50).required(),
    phoneNumber: Joi.string().pattern(uzPhoneRegex).required(),
    address: Joi.string().trim().required(),
    password: Joi.string().min(6).required(), // ✅ password
  });
  return schema.validate(data, { abortEarly: false });
};

