import { generate } from "otp-generator";

export const generateOTP = () => {
  return generate(6, {
    digits: true,
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};
