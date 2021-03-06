import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import seedRouter from "./routes/seedRoutes.js";
import productRouter from "./routes/produtcsRoutes.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

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
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.get("/api/key/paypal",(req, res)=>{
    res.send(process.env.PAYPAL_CLIENT_ID || "sb")
})

app.use("/api/seed", seedRouter)
app.use("/api/products", productRouter)
app.use("/api/users", userRouter)
app.use("/api/orders", orderRouter)


const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, "/shop-frontend/build")))
app.get("*",(req, res)=>{
    res.sendFile(path.join(__dirname, "/shop-frontend/build/index.html"))
})

app.use((err,req,res,next)=>{
    res.status(500).send({ message : err.message })
})

// app.get("/",(req, res)=>{
//     res.send("its works")
// })


const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("running port http://localhost/5000")
})