import Salesman from "../models/salesman.model.js";
import { resSuccess } from "../helpers/success-response.js";
import { errorHandle } from "../helpers/error-handle.js";
import {
  createSalesmanValidator,
  signUpSalesmanValidator,
  updateSalesmanValidator,
} from "../validations/salesman.validatin.js";
import { Crypto } from "../utils/encrypt-decrypt.js";
import { isValidObjectId } from "mongoose";

const crypto = new Crypto();

export class SalesmanController {
  async createSalesman(req, res) {
    try {
      const { value, error } = createSalesmanValidator(req.body);
      if (error) return errorHandle(res, error, 422);

      const exists = await Salesman.findOne({ phoneNumber: value.phoneNumber });
      if (exists) {
        return errorHandle(res, "Salesman already exists", 409);
      }

      const hashedPassword = await crypto.encrypt(value.password);

      const newSalesman = await Salesman.create({
        ...value,
        hashedPassword: hashedPassword,
      });
      return resSuccess(res, newSalesman, 201);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async getAllSalesmen(req, res) {
    try {
      const salesmen = await Salesman.find().sort({ createdAt: -1 });
      return resSuccess(res, salesmen);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async getSalesmanById(req, res) {
    try {
      const salesman = await SalesmanController.findSalesmanById(
        res,
        req.params.id
      );
      return resSuccess(res, salesman);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async updateSalesman(req, res) {
    try {
      const id = req.params.id;
      const salesman = await SalesmanController.findSalesmanById(res, id);
      const { value, error } = updateSalesmanValidator(req.body);
      if (error) return errorHandle(res, error, 422);
      let hashedPassword = salesman.hashedPassword;
      if (value.password) {
        hashedPassword = await crypto.encrypt(value.password);
      }
      const updatedSalesman = await Salesman.findByIdAndUpdate(
        id,
        { ...value, hashedPassword },
        { new: true, runValidators: true }
      );
      return resSuccess(res, updatedSalesman);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async deleteSalesman(req, res) {
    try {
      const id = req.params.id;
      await SalesmanController.findSalesmanById(res, id);
      await Salesman.findByIdAndDelete(id);

      return resSuccess(res, { message: "Salesman deleted successfully" });
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  static async findSalesmanById(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return errorHandle(res, "Invalid Object Id", 400);
      }
      const salesman = await Salesman.findById(id);
      if (!salesman) {
        return errorHandle(res, "Salesman not found", 404);
      }
      return salesman;
    } catch (error) {
      return errorHandle(res, error);
    }
  }
}
