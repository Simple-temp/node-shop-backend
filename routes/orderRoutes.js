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



export default orderRouter