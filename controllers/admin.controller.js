import { handleError, succesMessage } from "../helpers/error-success.js";
import Admin from "../models/admin.model.js";
import {
  confirmSigninAdminValidator,
  createAdminValidator,
  signinAdminValidator,
  updateAdminValidator,
} from "../validations/admin.validation.js";
import { Token } from "../utils/token-service.js";

import config from "../config/index.js";
import { generateOTP } from "../helpers/generate-otp.js";
import NodeCache from "node-cache";
import { sendMailPromise } from "../helpers/send-email.js";
import { isValidObjectId } from "mongoose";

const token = new Token();
const cache = new NodeCache();

export class AdminController {
  async createAdmin(req, res) {
    try {
      const { value, error } = createAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const isAdmin = await Admin.findOne({ username: value.username });
      if (isAdmin) {
        return handleError(res, "Admin already exists", 409);
      }
      const isEmail = await Admin.findOne({ email: value.email });
      if (isEmail) {
        return handleError(res, "Email already exsts", 409);
      }
      const isPhone = await Admin.findOne({ phone: value.phone });
      if (isPhone) {
        return handleError(res, "Phone already exsts", 409);
      }
      const newAdmin = await Admin.create(value);
      return succesMessage(res, newAdmin, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async signinAdmin(req, res) {
    try {
      const { value, error } = signinAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const username = value.username;
      const admin = await Admin.findOne({ username });
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      const email = value.email;
      const otp = generateOTP();
      const mailOptions = {
        from: config.OWNER_EMAIL,
        to: email,
        subject: "market",
        text: otp,
      };
      await sendMailPromise(mailOptions);
      cache.set(email, otp, 120);
      return succesMessage(res, `Email sent successfully. OTP: ${otp}`, 200);
    } catch (error) {
      console.error("Email yuborishda xatolik:", error);
      return handleError(res, error);
    }
  }
  async confirmSigninAdmin(req, res) {
    try {
      const { value, error } = confirmSigninAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const email = value.email;
      const cacheOTP = cache.get(email);
      if (!cacheOTP || cacheOTP != value.otp) {
        return handleError(res, "OTP expired", 400);
      }
      const admin = await Admin.findOne({ email });
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }

      const payload = { id: admin._id, role: admin.role };
      const refreshToken = await token.generateAccesToken(payload);
      const accessToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenAdmin", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return succesMessage(
        res,
        {
          data: admin,
          token: accessToken,
        },
        200
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
  async logoutAdmin(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenAdmin;
      if (!refreshToken) {
        return handleError(res, "Token expired", 400);
      }
      const decodedToken = await token.tokenVerify(
        refreshToken,
        config.REFRESH_TOKEN_KEY
      );
      console.log(decodedToken);
      if (!decodedToken) {
        return handleError(res, "Invalid token", 400);
      }
      const admin = await Admin.findById(decodedToken.id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      res.clearCookie("refreshTokenAdmin");
      return succesMessage(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllAdmins(_, res) {
    try {
      const admins = await Admin.find();
      return succesMessage(res, admins);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAdminById(req, res) {
    try {
      const id = req.params.id;
      const admin = await AdminController.findByIdAdmin(res, id);
      return succesMessage(res, admin);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateAdmin(req, res) {
    try {
      const id = req.params.id;
      const { value, error } = updateAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      await AdminController.findByIdAdmin(res, id);
      const newAdmin = await Admin.findByIdAndUpdate(id, value, { new: true });
      return succesMessage(res, newAdmin);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteAdmin(req, res) {
    try {
      const id = req.params.id;
      await AdminController.findByIdAdmin(res, id);
      await Admin.findByIdAndDelete(id);
      return succesMessage(res, "Deleted admin");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findByIdAdmin(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Id Format");
      }
      const admin = await Admin.findById(id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      return admin;
    } catch (error) {
      return handleError(res, error);
    }
  }
}

