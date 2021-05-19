const express = require("express");
const router = express.Router();
const { getAllCategoriesController, getCategoryByIdController, createCategoryController, updateCategroyController, deleteCategoryController } = require("../controllers/category")

router.route('/').get(getAllCategoriesController).post(createCategoryController);
router.route('/:categoryId').get(getCategoryByIdController).put(updateCategroyController).delete(deleteCategoryController);

module.exports = router;