const Category = require("../models/category");

//get all categories
exports.getAllCategoriesController = async(req, res, next) => {
    try {
        const categories = await Category.find();
        if (!categories) {
            res.status(500).json({
                status: "fail",
                message:"fail to get all categories"
            })
        }
        res.status(200).json({
            status: "success",
            data:categories
        })
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to get all categories ${ex}`
        });
        console.log(ex);
    }
}
//get category by id
exports.getCategoryByIdController = async(req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId);
        if (!category) {
            res.status(500).json({
                status: "fail",
                message:"fail to get category by id"
            })
        }
        res.status(200).json({
            status: "success",
            data:category
        })

    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to get category by id ${ex}`
        });
        console.log(ex);
    }
}
//create a new category
exports.createCategoryController = async(req, res, next) => {
    try {
        const category = await Category.create(req.body);
        if (!category) {
            res.status(500).json({
                status: "fail",
                message:"fail to create new category"
            })
        }
        res.status(200).json({
            status: "success",
            data:category
        })
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to create a new category ${ex}`
        });
        console.log(ex);
    }
}
//update category
exports.updateCategroyController = async(req, res, next) => {
    try {
        const category = await Category.findByIdAndUpdate(req.params.categoryId, req.body, {
            new: true,
            runValidators:true
        })
        res.status(201).json({
            status: 'success',
            data: category
        });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to update category ${ex}`
        });
        console.log(ex);
    }
}
//delete category
exports.deleteCategoryController = async(req, res, next) => {
    try {
        await Category.findByIdAndRemove(req.params.categoryId).then(() => {
            res.status(200).json({
                status: "success",
                message: "this category deleted successfully"
            });
        }).catch((err) => {
            res.status(500).json({
                status: "fail",
                message: `fail to delete the category ${err}`
            });
        });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to delete category ${ex}`
        });
        console.log(ex);
    }
}