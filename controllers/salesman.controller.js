import { handleError, succesMessage } from "../helpers/error-success.js";
import Salesman from "../models/salesman.model.js";
import {
  createSalesmanValidator,
  signinSalesmanValidator,
  updateSalesmanValidator,
} from "../validations/salesman.validatin.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import { Token } from "../utils/token-service.js";
import { isValidObjectId } from "mongoose";
import config from "../config/index.js";
const crypto = new Crypto();
const token = new Token();

export class SalesmanController {
  async creatSalesman(req, res) {
    try {
      const { value, error } = createSalesmanValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const phoneNumber = value.phoneNumber;
      const isClent = await Salesman.findOne({ phoneNumber });
      if (isClent) {
        return handleError(res, "Salesman already exists");
      }
      const hashPass = await crypto.encrypt(value.password);
      const newSalesman = await Salesman.create({
        ...value,
        password: hashPass,
      });
      return succesMessage(res, newSalesman, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async signinSalesman(req, res) {
    try {
      const { value, error } = signinSalesmanValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const salesman = await Salesman.findOne({ email: value.email });
      if (!salesman) {
        return handleError(res, "Salesman not found", 404);
      }
      const pass = await crypto.decrypt(value.password, salesman.password);
      if (!pass) {
        return handleError(res, "Salesman not found");
      }
      const payload = { id: salesman._id, role: "salesman" };
      const refreshToken = await token.generateAccesToken(payload);
      const accessToken = await token.generateRefreshToken(payload);
      res.cookie("refreshTokenSalesman", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      return succesMessage(
        res,
        {
          data: salesman,
          token: accessToken,
        },
        200
      );
    } catch (error) {
      return handleError(res, error);
    }
  }
  async logoutSalesman(req, res) {
    try {
      const refreshToken = req.cookies?.refreshTokenSalesman;
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
      const salesman = await Salesman.findById(decodedToken.id);
      if (!salesman) {
        return handleError(res, "Salesman not found", 404);
      }
      res.clearCookie("refreshTokenSalesman");
      return succesMessage(res, {});
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllSalesmans(_, res) {
    try {
      const salesmans = await Salesman.find().populate("products");
      return succesMessage(res, salesmans);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getSalesmanById(req, res) {
    try {
      const id = req.params.id;
      const salesman = await SalesmanController.findByIdSalesman(res, id);
      return succesMessage(res, salesman);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateSalesman(req, res) {
    try {
      const id = req.params.id;
      const { value, error } = updateSalesmanValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      await SalesmanController.findByIdSalesman(res, id);
      const newSalesman = await Salesman.findByIdAndUpdate(id, value, {
        new: true,
      });
      return succesMessage(res, newSalesman);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteSalesman(req, res) {
    try {
      const id = req.params.id;
      await SalesmanController.findByIdSalesman(res, id);
      await Salesman.findByIdAndDelete(id);
      return succesMessage(res, "Deleted salesman");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findByIdSalesman(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Id Format");
      }
      const salesman = await Salesman.findById(id).populate("products");
      if (!salesman) {
        return handleError(res, "Salesman not found", 404);
      }
      return salesman;
    } catch (error) {
      return handleError(res, error);
    }
  }
}


