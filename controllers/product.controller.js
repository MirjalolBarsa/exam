import { handleError, succesMessage } from "../helpers/error-success.js";
import Product from "../models/product.model.js";
import { isValidObjectId } from "mongoose";
import {
  createProductValidator,
  updateProductValidator,
} from "../validations/product.validation.js";
import Category from "../models/category.model.js";
import Salesman from "../models/salesman.model.js";

 export class ProductController {
  async createProduct(req, res) {
    try {
      const { value, error } = createProductValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const isCategory = await Category.findById(value.categoryId);
      if (!isCategory) {
        return handleError(res, "Category not found", 404);
      }
      const isSalesman = await Salesman.findById(value.salesmanId);
      if (!isSalesman) {
        return handleError(res, "Salesman not found", 404);
      }
      const newProduct = await Product.create(value);
      return succesMessage(res, newProduct, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllProduct(_, res) {
    try {
      const products = await Product.find()
        .populate("categoryId")
        .populate("salesmanId");
      return succesMessage(res, products);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getProductById(req, res) {
    try {
      const product = await ProductController.findByIdProduct(
        res,
        req.params.id
      );
      return succesMessage(res, product);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateProduct(req, res) {
    try {
      const id = req.params.id;
      await ProductController.findByIdProduct(res, id);
      const { value, error } = updateProductValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const newProduct = await Product.findByIdAndUpdate(id, value, {
        new: true,
      });
      return succesMessage(res, newProduct);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      await ProductController.findByIdProduct(res, id);
      const newProduct = await Product.findByIdAndDelete(id);
      return succesMessage(res, "Deleted Product");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findByIdProduct(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Id Format");
      }
      const products = await Product.findById(id)
        .populate("categoryId")
        .populate("salesmanId");
      if (!products) {
        return handleError(res, "Product not found", 404);
      }
      return products;
    } catch (error) {
      return handleError(res, error);
    }
  }
}

