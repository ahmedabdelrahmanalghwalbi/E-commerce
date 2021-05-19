const express = require("express");
const router = express.Router();
const {getAllProductsController,getProductByIdController,createProductController,updateProductController,deleteProductController,productCounts } = require("../controllers/product");

//multer
const multer = require("multer");
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `bootcamp-${file.originalname}-${Date.now()}.${ext}`);
    }
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb("not an Image", false);
    }
};
const upload = multer({
    storage: multerStorage,
    multerFilter: multerFilter,
})

router.route('/').get(getAllProductsController).post(upload.fields([
    { name: 'image', maxCount: 1 },
    {name:'images',maxCount:3}]),createProductController);
router.route('/:productId').get(getProductByIdController).put(updateProductController,upload.single('image')).delete(deleteProductController);
router.route('/productsCounts').get(productCounts);
module.exports = router;