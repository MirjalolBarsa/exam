import { handleError, succesMessage } from "../helpers/error-success.js";
import SolidProduct from "../models/solidProduct.model.js";
import { isValidObjectId } from "mongoose";
import {
  createSolidProductValidator,
  updateSolidProductValidator,
} from "../validations/solidProduct.validation.js";
import Product from "../models/product.model.js";
import Clent from "../models/client.model.js";

  export class SolidProductController {
  async createSolid(req, res) {
    try {
      const { value, error } = createSolidProductValidator(req.body);
      if (error) {
        return handleError(res, error, 404);
      }
      const { productId, clientId, quantity } = value;
      const product = await Product.findById(productId);
      if (!product) {
        return handleError(res, "Product not found", 404);
      }
      const client = await Clent.findById(clientId);
      if (!client) {
        return handleError(res, "Client not found", 404);
      }
      const totalPrice = quantity * product.price;

      const soldproduct = await SolidProduct.create({
        productId,
        clientId,
        quantity,
        totalPrice,
      });
      return successRes(res, soldproduct, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllSolidProduct(_, res) {
    try {
      const solidProducts = await SolidProduct.find()
        .populate("productId")
        .populate("clentId");
      return succesMessage(res, solidProducts);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getSolidProductById(req, res) {
    try {
      const solidProduct = await SolidProductController.findByIdSolidProduct(
        res,
        req.params.id
      );
      return succesMessage(res, solidProduct);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateSolidProduct(req, res) {
    try {
      const id = req.params.id;
      await SolidProductController.findByIdSolidProduct(res, id);
      const { value, error } = updateSolidProductValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const newSolidProduct = await SolidProduct.findByIdAndUpdate(id, value, {
        new: true,
      });
      return succesMessage(res, newSolidProduct);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteSolidProduct(req, res) {
    try {
      const id = req.params.id;
      await SolidProductController.findByIdSolidProduct(res, id);
      const newSolidProduct = await SolidProduct.findByIdAndDelete(id);
      return succesMessage(res, "Deleted Solid-Product");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findByIdSolidProduct(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Id Format");
      }
      const solidProduct = await SolidProduct.findById(id)
        .populate("productId")
        .populate("clentId");
      if (!solidProduct) {
        return handleError(res, "Solid-Product not found", 404);
      }
      return solidProduct;
    } catch (error) {
      return handleError(res, error);
    }
  }
}
