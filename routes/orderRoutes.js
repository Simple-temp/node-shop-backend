import express from "express";
import expressAsyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import { isAuth } from "../Utilits.js";
import Stripe from "stripe"

const stripe = Stripe("sk_test_51KJhEFFesKPGWiP3zNJLsNtGy1i22HxxfjJrvJuiYiDMKv8A675V0XqyyId3vKfS4oWnsfXRwH63Y7Lk4H4HuWF8009M1hdt31") 


const orderRouter = express.Router()

orderRouter.get("/",async(req, res)=>{

    const users = await Order.find()
    res.send(users)

})

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

orderRouter.get("/mine", isAuth ,expressAsyncHandler( async (req, res)=>{
    const orders = await Order.find({ user: req.user._id })
    if(orders){
        res.send(orders)
    }else{
        res.status(404).send({ message : "orders not found" })
    }
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
        res.status(404).send({ message : "Payment not complete" })
    }
}))

orderRouter.put("/:id/stripe", async (req, res)=>{

    // const {amount, token} = req.body;
    // console.log(token)

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

        console.log(order)

        const updateOrder = await order.save()

        res.send( { message: "Order paid", order : updateOrder } )
    }else{
        res.status(404).send({ message : "Payment not complete" })
    }

})

orderRouter.delete("/:id/delete", async (req, res)=>{

    const order = await Order.findById(req.params.id)
    if(order){
        console.log(order)
        await order.deleteOne()

        res.send( { message: "deleted"} )
    }else{
        res.status(404).send({ message : "delete not complete" })
    }


})

orderRouter.put("/:id/delireved", async (req, res)=>{
     
    const order = await Order.findById(req.params.id)
    if(order){
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        order.paymentresult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };

        console.log(order)

        const updateOrder = await order.save()

        res.send( { message: "Order paid", order : updateOrder } )
    }else{
        res.status(404).send({ message : "Payment not complete" })
    }
})


export default orderRouter