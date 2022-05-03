import express from "express";
import Data from "../Data.js";
import user from "../User.js"
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

const seedRouter = express.Router()

seedRouter.get("/", async( req, res )=>{
    await Product.remove({})
    const createProducts = await Product.insertMany(Data)
    await User.remove({})
    const createUsers = await User.insertMany(user)
    res.send({ createProducts, createUsers })
})

export default seedRouter;