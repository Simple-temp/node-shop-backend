import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth } from "../Utilits.js";


const orderRouter = express.Router()

orderRouter.post("/", isAuth ,expressAsyncHandler( async (req, res)=>{
    const newOrder = new Order({
        orderItem : req.body.orderItem.map( x => ({ ...x, product:x._id }) ),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        itemPrice: req.body.itemPrice,
        shippingPrice: req.body.shippingPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
    })
    console.log(newOrder)
    const order = await newOrder.save()

    res.status(201).send({ message : "New order created", order })
}))

orderRouter.get("/:id", isAuth ,expressAsyncHandler( async (req, res)=>{
    const order = await Order.findById(req.params.id)
    if(order){
        res.send(order)
    }else{
        res.status(404).send({ message : "order not found" })
    }
}))

orderRouter.put("/:id/pay", isAuth ,expressAsyncHandler( async (req, res)=>{
    const order = await Order.findById(req.params.id)
    if(order){
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentresult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        const updateOrder = await order.save()

        res.send( { message: "Order paid", order : updateOrder } )
    }else{
        res.status(404).send({ message : "order not found" })
    }
}))


export default orderRouter