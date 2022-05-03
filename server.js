import express from "express";
import cors from "cors";
import bodyParser from "body-parser"
import mongoose from "mongoose";
import dotenv from "dotenv"
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/produtcsRoutes.js";

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
app.use("/api/products", productRouter)


const port = process.env.PORT || 5000;

app.listen(port,()=>{
    console.log("running port http://localhost/5000")
})