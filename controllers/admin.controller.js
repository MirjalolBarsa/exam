import Admin from "../models/admin.model.js";
import { errorHandle } from "../helpers/error-handle.js";
import { resSuccess } from "../helpers/success-response.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import { isValidObjectId } from "mongoose";
import config from "../config/index.js";
import {
  createAdminValidator,
  updateAdminValidator,
} from "../validations/admin.validation.js";

const crypto = new Crypto();

export class AdminController {
  async createAdmin(req, res) {
    try {
      const { value, error } = createAdminValidator(req.body);
      if (error) {
        return errorHandle(res, error, 422);
      }
      const existsUsername = await Admin.findOne({ username: value.username });
      if (existsUsername) {
        return errorHandle(res, "Username already exists", 409);
      }
      const hashedPassword = await crypto.encrypt(value.password);
      const admin = await Admin.create({
        username: value.username,
        email: value.email,
        phoneNumber: value.phoneNumber, // 🟢 BU SHART!
        hashedPassword,
      });

      return resSuccess(res, admin, 201);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async signInAdmin(req, res) {
    try {
      const { value, error } = createAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const admin = await Admin.findOne({ username: value.username });
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      const payload = { id: admin._id, role: admin.role };
      const accessToken = await token.generateAccessToken(payload);
      const refreshToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenAdmin", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return successRes(
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

  async newAccessToken(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenAdmin;
      if (!refreshToken) {
        return handleError(res, "Refresh token epxired", 400);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 400);
      }
      const admin = await Admin.findById(decodedToken.id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      const payload = { id: admin._id, role: admin.role };
      const accessToken = await token.generateAccessToken(payload);
      return successRes(res, {
        token: accessToken,
      });
    } catch (error) {
      return handleError(res, error);
    }
  }

  async logOut(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenAdmin;
      if (!refreshToken) {
        return handleError(res, "Refresh token epxired", 400);
      }
      const decodedToken = await token.verifyToken(
        refreshToken,
        config.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 400);
      }
      const admin = await Admin.findById(decodedToken.id);
      if (!admin) {
        return handleError(res, "Admin not found", 404);
      }
      res.clearCookie("refreshTokenAdmin");
      return successRes(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }

  async getAllAdmin(req, res) {
    try {
      const admins = await Admin.find();
      return resSuccess(res, admins);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async getAdminById(req, res) {
    try {
      const admin = await AdminController.findAdminById(res, req.params.id);
      return resSuccess(res, admin);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async updateAdmin(req, res) {
    try {
      const id = req.params.id;
      const admin = await AdminController.findAdminById(res, id);
      const { value, error } = updateAdminValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      let hashedPassword = admin.hashedPassword;
      if (value.password) {
        hashedPassword = await crypto.encrypt(password);
      }
      const updatedAdmin = await Admin.findByIdAndUpdate(
        id,
        {
          ...value,
          hashedPassword,
        },
        { new: true }
      );
      return successRes(res, updatedAdmin);
    } catch (error) {
      return handleError(res, error);
    }
  }

  async deleteAdmin(req, res) {
    try {
      const id = req.params.id;
      await AdminController.findAdminById(res, id);
      await Admin.findByIdAndDelete(id);
      return successRes(res, { message: "Admin deleted successfully" });
    } catch (error) {
      return handleError(res, error);
    }
  }

  static async findAdminById(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return errorHandle(res, "Invalid Object Id", 400);
      }
      const admin = await Admin.findById(id);
      if (!admin) {
        return errorHandle(res, "Admin not found", 404);
      }
      return admin;
    } catch (error) {
      return errorHandle(res, error);
    }
  }
}
