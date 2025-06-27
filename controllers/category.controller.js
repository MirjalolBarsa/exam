import { handleError, succesMessage } from "../helpers/error-success.js";
import Category from "../models/category.model.js";
import {
  createCategoryValidator,
  updateCategoryValidator,
} from "../validations/category.validation.js";
import { isValidObjectId } from "mongoose";

 export class CategoryController {
  async creatCategory(req, res) {
    try {
      const { value, error } = createCategoryValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      const newCategory = await Category.create(value);
      return succesMessage(res, newCategory, 201);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getAllCategorys(_, res) {
    try {
      const category = await Category.find().populate("products");
      return succesMessage(res, category);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async getCategoryById(req, res) {
    try {
      const id = req.params.id;
      const category = await CategoryController.findByIdCategory(res, id);
      return succesMessage(res, category);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async updateCategory(req, res) {
    try {
      const id = req.params.id;
      const { value, error } = updateCategoryValidator(req.body);
      if (error) {
        return handleError(res, error, 422);
      }
      await CategoryController.findByIdCategory(res, id);
      const newCategory = await Category.findByIdAndUpdate(id, value, {
        new: true,
      });
      return succesMessage(res, newCategory);
    } catch (error) {
      return handleError(res, error);
    }
  }
  async deleteCategory(req, res) {
    try {
      const id = req.params.id;
      await CategoryController.findByIdCategory(res, id);
      await Category.findByIdAndDelete(id);
      return succesMessage(res, "Deleted category");
    } catch (error) {
      return handleError(res, error);
    }
  }
  static async findByIdCategory(res, id) {
    try {
      if (!isValidObjectId(id)) {
        return handleError(res, "Invalid Id Format");
      }
      const category = await Category.findById(id).populate("products");
      if (!category) {
        return handleError(res, "Category not found", 404);
      }
      return category;
    } catch (error) {
      return handleError(res, error);
    }
  }
}


