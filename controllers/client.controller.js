import { handleError, succesMessage } from "../helpers/error-success.js";
import Clent from "../models/client.model.js";
import {
  creatClentValidator,
  signinClentValidator,
  updateClentValidator,
} from "../validations/client.validation.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import { Token } from "../utils/token-service.js";
import { isValidObjectId } from "mongoose";
import config from "../config/index.js";

const crypto = new Crypto();
const token = new Token();

export class ClentController {
  async creatClent(req, res) {
    try {
      const { value, error } = creatClentValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const phoneNumber = value.phoneNumber;
      const isClent = await Clent.findOne({ phoneNumber });
      if (isClent) {
        return handleError(res, "Clent already exists");
      }
      const hashPass = await crypto.encrypt(value.password);
      const newClent = await Clent.create({
        ...value,
        password: hashPass,
      });
      return succesMessage(res, newClent, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async signinClent(req, res) {
    try {
      const { value, error } = signinClentValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const clent = await Clent.findOne({ phoneNumber: value.phoneNumber });
      if (!clent) {
        return handleError(res, "Clent not found", 404);
      }
      const pass = await crypto.decrypt(value.password, clent.password);
      if (!pass) {
        return handleError(res, "Clent not found");
      }
      const payload = { id: clent._id };
      const refreshToken = await token.generateAccesToken(payload);
      const accessToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenClent", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return succesMessage(
        res,
        {
          data: clent,
          token: accessToken,
        },
        200
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
  async logoutClent(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenClent;
      if (!refreshToken) {
        return handleError(res, "Token expired", 400);
      }
      const decodedToken = await token.tokenVerfy(
        refreshToken,
        config.REFRESH_TOKEN_KEY
      );
      if (!decodedToken) {
        return handleError(res, "Invalid token", 400);
      }
      const clent = await Clent.findById(decodedToken.id);
      if (!clent) {
        return handleError(res, "Clent not found", 404);
      }
      res.clearCookie("refreshTokenClent");
      return succesMessage(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllClents(_, res) {
    try {
      const clents = await Clent.find().populate("solid");
      return succesMessage(res, clents);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getClentById(req, res) {
    try {
      const id = req.params.id;
      const clent = await ClentController.findByIdClent(res, id);
      return succesMessage(res, clent);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateClent(req, res) {
    try {
      const id = req.params.id;
      const { value, error } = updateClentValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      await ClentController.findByIdClent(res, id);
      const newClent = await Clent.findByIdAndUpdate(id, value, { new: true });
      return succesMessage(res, newClent);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteClent(req, res) {
    try {
      const id = req.params.id;
      await ClentController.findByIdClent(res, id);
      await Clent.findByIdAndDelete(id).populate("solid");
      return succesMessage(res, "Deleted clent");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findByIdClent(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Id Format");
      }
      const clent = await Clent.findById(id).populate("solid");
      if (!clent) {
        return handleError(res, "Clent not found", 404);
      }
      return clent;
    } catch (error) {
      return handleError(res, error);
    }
  }
}


