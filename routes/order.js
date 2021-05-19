const express = require("express");
const router = express.Router();
const {getAllOrdersController,getOrderByIdController,createOrderController,updateOrderController,deleteOrderController } = require("../controllers/order");

router.route('/').get(getAllOrdersController).post(createOrderController);
router.route('/:orderId').get(getOrderByIdController).put(updateOrderController).delete(deleteOrderController)

module.exports = router;