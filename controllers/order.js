const Order = require("../models/orders");
const OrderItem = require("../models/orderItem");

//get all orders
exports.getAllOrdersController =async (req,res,next) => {
    try {
        const orders = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
        if(!orders) {
            res.status(500).json({
                status: "fail",
                message: "failed to get the list of products"
            });
        } 
        if (!orders) {
            res.status(400).json({
                status: "fail",
                message:"fail to get all orders"
            })
        }
        res.status(200).json({
            status: "success",
            message:orders
        })
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to get all orders ${ex}`
        });
        console.log(ex);
    }
}

//get order by id
exports.getOrderByIdController =async (req,res,next) => {
    try {
         const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({ 
                path: 'orderItems', populate: {
                path : 'product', populate: 'category'} 
            });
    if(!order) {
        res.status(500).json({success: false})
    } 
        if (!order) {
            res.status(400).json({
                status: "fail",
                message:"fail to get order by id"
            })
        }
        res.status(200).json({
            status: "success",
            message:orders
        })
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to get order by id ${ex}`
        });
        console.log(ex);
    }
}

//create order
exports.createOrderController =async (req,res,next) => {
    try {
        //here i want to store the orderItems id's in the order so that i will store first the orderItems in the database the i will retrive only the id's to store it in the order (orderItemsField).
         const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))
        const orderItemsIdsResolved = await orderItemsIds;
        const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
        const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice
        }))
        const totalPrice = totalPrices.reduce((a,b) => a +b , 0);
       let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    })
    order = await order.save();
        res.send(order);
        
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to create order ${ex}`
        });
        console.log(ex);
    }
}

//update order
exports.updateOrderController =async (req,res,next) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status
            },
            { new: true }
        );
        if (!order) {
            res.status(500).json({
                status: "fail",
                message:"failed to update the order"
            })
        }
            
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to update the order ${ex}`
        });
        console.log(ex);
    }
}

//delete order
exports.deleteOrderController =async (req,res,next) => {
    try {
        Order.findByIdAndRemove(req.params.orderId).then(async order => {
            if (order) {
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndRemove(orderItem)
                })
                return res.status(200).json({ status: "success", message: 'the order is deleted!' })
            } else {
                return res.status(404).json({ status: "fail", message: "order not found!" })
            }
        });
    } catch (ex) {
        res.status(400).json({
            status: "fail",
            message: `fail to delete this order orders ${ex}`
        });
        console.log(ex);
    }
}

//get the total sales
exports.totalSalesPrice = async (req, res, next) => {
    try {
        const totalSales= await Order.aggregate([
            { $group: { _id: null , totalsales : { $sum : '$totalPrice'}}}
        ])
        if(!totalSales) {
            return res.status(400).json({
                status: "fail",
                message:'The order sales cannot be generated'
            });
        }
        res.json({
            status:"success",
            totalsales: totalSales.pop().totalsales
        })
    } catch (ex) {
        res.status(500).json({
            status: "fail",
            message: `failed with getting the total price`
        });
    }
}

//get total counts of orders
exports.getOrdersCount = async (req, res, next) => {
    try {
        const orderCount = await Order.countDocuments((count) => count);
        if(!orderCount) {
            res.status(500).json({
                status: "fail",
                message:"failed to get the orders count"
            })
        } 
        res.status(200).send({
            status:"success",
            orderCount: orderCount
        });
    } catch (ex) {
        res.status(500).json({
            status: "fail",
            message:`failed to get the the orders count ${ex}`
        })
    }
}

//get user orders by the user id
exports.getUserOrders = async (req, res, next) => {
    try {
            const userOrderList = await Order.find({user: req.params.userId}).populate({ 
                path: 'orderItems', populate: {
                    path : 'product', populate: 'category'} 
            }).sort({'dateOrdered': -1});
            if(!userOrderList) {
                res.status(500).json({
                    status: "fail",
                    message:"failed to find the user orders"
                })
            } 
        res.json({
            status: "success",
            userOrderList:userOrderList
        });
    } catch (ex) {
        res.status(500).json({
            status: "fail",
            message:`failed to get the products of this User ${ex}`
        })
    }
}