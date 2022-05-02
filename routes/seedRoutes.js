import express from "express";
import Data from "../Data.js";
import Product from "../models/productModel.js";

const seedRouter = express.Router()

seedRouter.get("/", async( req, res )=>{
    await Product.remove({})
    const createProducts = await Product.insertMany(Data)
    res.send({ createProducts })
})

export default seedRouter;