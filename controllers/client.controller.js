import Client from "../models/client.model.js";
import { resSuccess } from "../helpers/success-response.js";
import { errorHandle as resError } from "../helpers/error-handle.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import {
  signUpClientValidator,
  signInClientValidator,
} from "../validations/client.validation.js";
import { Token } from "../utils/token-service.js";

const crypto = new Crypto();
const token = new Token();

export class ClientController {
  // ✅ SIGN UP (ro‘yxatdan o‘tish)
  async signUpClient(req, res) {
    try {
      const { value, error } = signUpClientValidator(req.body);
      if (error) {
        return resError(res, error, 422);
      }

      const exists = await Client.findOne({
        phoneNumber: value.phoneNumber,
      });

      if (exists) {
        return resError(res, "Phone number already taken", 409);
      }

      const hashedPassword = await crypto.encrypt(value.password);

      const client = await Client.create({
        name: value.name,
        phoneNumber: value.phoneNumber,
        address: value.address,
        hashedPassword,
      });

      return resSuccess(res, 201, "Client registered", {
        client,
      });
    } catch (error) {
      return resError(res, error);
    }
  }

  // ✅ SIGN IN (tizimga kirish)
  async signInClient(req, res) {
    try {
      const { value, error } = signInClientValidator(req.body);
      if (error) {
        return resError(res, error, 422);
      }

      const client = await Client.findOne({ phoneNumber: value.phoneNumber });
      if (!client) {
        return resError(res, "Phone number or password incorrect", 400);
      }

      const isMatch = await crypto.compare(
        value.password,
        client.hashedPassword
      );

      if (!isMatch) {
        return resError(res, "Phone number or password incorrect", 400);
      }

      const payload = { id: client._id, role: "client" };
      const accessToken = await token.generateAccessToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);

      res.cookie("refreshTokenClient", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return resSuccess(res, 200, "Login successful", {
        token: accessToken,
        client,
      });
    } catch (error) {
      return resError(res, error);
    }
  }

  async logoutClient(req, res) {
    try {
      res.clearCookie("refreshTokenClient", {
        httpOnly: true,
        secure: true,
      });
      return resSuccess(res, 200, "Logged out successfully");
    } catch (error) {
      return resError(res, error);
    }
  }
}
