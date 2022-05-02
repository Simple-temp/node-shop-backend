import express from "express";
import Data from "./Data.js";
import cors from "cors";
import bodyParser from "body-parser"
import mongoose from "mongoose";
import dotenv from "dotenv"
import seedRouter from "./routes/seedRoutes.js";

dotenv.config()


mongoose
.connect(process.env.MONGO_DB_URI)
.then(()=>{
    console.log("connected to db")
}).catch(err=>{
    console.log(err.message)
})



const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use("/api/seed", seedRouter)

app.get("/api/products",(req,res)=>{
    res.send(Data)
})

app.get("/api/products/details/:slug",(req,res)=>{
    const product = Data.find( x => x.slug === req.params.slug)
    if(product){
        res.send(product)
    }else{
        res.status(404).send({ message : "product not found" })
    }
})

app.get("/api/products/cart/:slug",(req,res)=>{
    const product = Data.find( x => x.slug === req.params.slug)
    if(product){
        res.send(product)
    }else{
        res.status(404).send({ message : "product not found" })
    }
})

const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log("running port http://localhost/5000")
})