import Category from "../models/category.model.js";
import { errorHandle } from "../helpers/error-handle.js";
import { resSuccess } from "../helpers/success-response.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validations/category.validation.js";
import { isValidObjectId } from "mongoose";

export class CategoryController {
  async createCategory(req, res) {
    try {
      const { value, error } = createCategoryValidator(req.body);
      if (error) {
        return errorHandle(res, "Category not found", 404);
      }
      const exists = await Category.findOne({ name: value.name });
      if (exists) {
        return errorHandle(res, "Category already exists", 409);
      }
      const category = await Category.create({
        name: value.name,
      });
      return resSuccess(res, category);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async getAllCategory(_req, res) {
    try {
      const categories = await Category.find();
      return resSuccess(res, categories);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async getCategoryById(req, res) {
    try {
      const category = await CategoryController.findCategoryById(
        res,
        req.params.id
      );
      return resSuccess(res, category);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const { value, error } = updateCategoryValidator(req.body);
      if (error) {
        return errorHandle(res, error);
      }
      const updatedCategory = await Category.findByIdAndUpdate(id, {
        ...value,
      });
      return resSuccess(res, updatedCategory);
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  async deleteCategory(req, res) {
    try {
      const id = req.params.id;
      await CategoryController.findCategoryById(res, id);
      await Category.findByIdAndDelete(id);
      return resSuccess(res, "Category deleted successfully");
    } catch (error) {
      return errorHandle(res, error);
    }
  }

  static async findCategoryById(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return errorHandle(res, "Invalid Object Id", 400);
      }
      const category = await Category.findById(id);
      if (!category) {
        return errorHandle(res, "Category not found", 404);
      }
      return category;
    } catch (error) {
      return errorHandle(res, error);
    }
  }
}
