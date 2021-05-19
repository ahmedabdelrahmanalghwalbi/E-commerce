const Product = require("../models/product");


//get all products
exports.getAllProductsController =async (req,res,next) => {
    try {
        let filter = {};
        if (req.query.categories) {
            filter = { category: req.query.categories.split(',') };
        }
        const products = await Product.find(filter).populate("category");
        if (!products) {
            res.status(500).json({
                status: "fail",
                message:"fail to get all Products"
            })
        }
        res.status(200).json({
            status: "success",
            data:products
        })
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to get all products ${ex}`
        });
        console.log(ex);
    }
}
//get product by id
exports.getProductByIdController =async (req,res,next) => {
    try {
        const product = await Product.findById(req.params.productId).populate("category");
        if (!product) {
            res.status(500).json({
                status: "fail",
                message:"fail to get product by id"
            })
        }
        res.status(200).json({
            status: "success",
            data:product
        })
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to get product by id ${ex}`
        });
        console.log(ex);
    }
}

//create new product
exports.createProductController =async (req,res,next) => {
    try {
        console.log(req.body)
         const product = await Product.create(req.body);
        if (!product) {
            res.status(500).json({
                status: "fail",
                message:"fail to create a product"
            })
        }
        res.status(200).json({
            status: "success",
            data:product
        })
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to create a new product${ex}`
        });
        console.log(ex);
    }
}

//update product by Id
exports.updateProductController =async (req,res,next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.productId, req.body, {
            new: true,
            runValidators:true
        })
        res.status(200).json({
            status: 'success',
            data: product
        });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to update product${ex}`
        });
        console.log(ex);
    }
}

//deleting product
exports.deleteProductController =async (req,res,next) => {
    try {
         await Product.findByIdAndRemove(req.params.productId).then(() => {
            res.status(200).json({
                status: "success",
                message: "this product deleted successfully"
            });
        }).catch((err) => {
            res.status(500).json({
                status: "fail",
                message: `fail to delete the product ${err}`
            });
        });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to delete product${ex}`
        });
        console.log(ex);
    }
}

//get products count
exports.productCounts = async (req, res, next) => {
    try {
        const productsCount = await Product.countDocuments((count) => count);
        if (!productsCount) {
            res.status(500).json({
                status: "fail",
                message:"fail to get the counts of products"
            })
        }
        res.status(200).json({
            status: "success",
            data:productsCount
        })
    } catch (ex) {
        res.status(500).json({
            status: "fail",
            message: `fail to get the counts of products ${ex}`
        });
        console.log(ex);
    }
}