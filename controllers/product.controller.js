import Product from "../models/product.model.js";
import { errorHandle } from "../helpers/error-handle.js";
import { resSuccess } from "../helpers/success-response.js";
import {
  createProductValidator,
  updateProductValidator,
} from "../validations/product.validation.js";
import { isValidObjectId } from "mongoose";

export class ProductController {
  // ✅ Create Product
  async createProduct(req, res) {
    try {
      const { value, error } = createProductValidator(req.body);
      if (error) {
        return errorHandle(
          res,
          error.details.map((e) => e.message).join(", "),
          400
        );
      }

      const exists = await Product.findOne({
        name: value.name,
      });
      if (exists) {
        return errorHandle(res, "Product already exists", 409);
      }

      const product = await Product.create({
        name: value.name,
        description: value.description,
        price: value.price,
        quantity: value.quantity,
        color: value.color,
        salesmanId: value.salesmanId,
        categoryId: value.categoryId,
      });
      return resSuccess(res, product, 201);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  // ✅ Get All Products
  async getAllProduct(_req, res) {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      return resSuccess(res, products, 200);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  // ✅ Get Product By ID
  async getProductById(req, res) {
    try {
      const product = await ProductController.findProductById(
        res,
        req.params.id
      );
      return resSuccess(res, product, 200);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  // ✅ Update Product
  async updateProduct(req, res) {
    try {
      const id = req.params.id;

      const { value, error } = updateProductValidator(req.body);
      if (error) {
        return errorHandle(
          res,
          error.details.map((e) => e.message).join(", "),
          400
        );
      }

      await ProductController.findProductById(res, id); // tekshir
      const updatedProduct = await Product.findByIdAndUpdate(id, value, {
        new: true,
      });
      return resSuccess(res, updatedProduct, 200);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  // ✅ Delete Product
  async deleteProduct(req, res) {
    try {
      const id = req.params.id;
      await ProductController.findProductById(res, id); // mavjudligini tekshir
      await Product.findByIdAndDelete(id);
      return resSuccess(res, `id = ${id} Product deleted successfully`, 200);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  // ✅ Helper: Find product by ID with error handling
  static async findProductById(res, id) {
    if (!isValidObjectId(id)) {
      throw new Error("Invalid Object ID");
    }
    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}
