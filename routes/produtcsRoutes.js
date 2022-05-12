import express, { query } from "express";
import expressAsyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

const productRouter = express.Router()

productRouter.get("/",async(req, res)=>{
    const products = await Product.find()
    res.send(products)
})

productRouter.post("/", async (req, res)=>{
    const newProduct = new Product({
            slug : req.body.slug,
            name : req.body.name,
            category : req.body.category,
            description : req.body.description,
            price : req.body.price,
            quantity : req.body.quantity || 1,
            stock : req.body.stock,
            reviews : req.body.reviews || 0,
            rating : req.body.rating,
            img : req.body.img,
    })
    console.log(newProduct)
    const product = await newProduct.save()
    res.send({
        _id:product._id,
        slug : product.slug,
        name : product.name,
        category : product.category,
        description : product.description,
        price : product.price,
        quantity : product.quantity || 1,
        stock : product.stock,
        reviews : product.reviews || 0,
        rating : product.rating,
        img : product.img,
    })
})

productRouter.delete("/:id/delete" , async (req,res)=>{
    const product = await Product.findById(req.params.id) 
    if(product){
        console.log(product)
        await product.deleteOne()
        res.send( { message: "deleted"} )
    }else{
        res.status(404).send({ message : "delete not complete" })
    }
})

const PAGE_SIZE=3
productRouter.get("/search",expressAsyncHandler( async(req, res)=>{
    const {query} = req
    const pageSize = query.pageSize || PAGE_SIZE
    const page = query.page || 1
    const category = query.category || ""
    const brand = query.brand || ""
    const price = query.price || ""
    const rating = query.rating || ""
    const order = query.order || ""
    const searchQuery = query.query || ""

    const queryFilter = searchQuery && searchQuery !== "all" ?
    {

        name : {
            $regex:searchQuery,
            $options : "i",
        }

    } : {}

    const categoryFilter = category && category !== "all" ? {category} : {}

    const ratingFilter = rating && rating !== "all" ? {
        rating : {
            $gte:Number(rating)
        }
    } : {}

    const priceFilter = price && price !== "all" ? {
        price : {
            $gte:Number(price.split('-')[0]),
            $lte:Number(price.split('-')[1])
        }
    } : {}

    const sortOrder = 
    order === "featured"
    ? {featured: -1}
    : order === "lowest"
    ? {price : 1}
    : order === "highest"
    ? {price : -1}
    : order === "toprated"
    ? {rating : -1}
    : order === "newest"
    ? {createdAt : -1}
    : {_id : -1}

    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    })

    .sort(sortOrder)
    .skip(pageSize * (page - 1))
    .limit(pageSize)

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...priceFilter,
        ...ratingFilter,
    })
    
    res.send({
        products,
        countProducts,
        page,
        pages : Math.ceil(countProducts / pageSize),
    })
}))

productRouter.get(
    "/categories" , 
    expressAsyncHandler( async (req, res)=>{
    const categories = await Product.find().distinct("category")
    res.send(categories)
    console.log(categories)
}))

productRouter.get("/details/:_id", async (req,res)=>{
    const product = await Product.findOne({_id: req.params._id})
    if(product){
        res.send(product)
    }else{
        res.status(404).send({ message : "product not found" })
    }
})

productRouter.get("/cart/:_id", async (req,res)=>{
    const product = await Product.findById(req.params._id)
    if(product){
        res.send(product)
    }else{
        res.status(404).send({ message : "product not found" })
    }
})

productRouter.get("/edit/:_id", async (req,res)=>{
    const product = await Product.findById(req.params._id)
    if(product){
        res.send(product)
    }else{
        res.status(404).send({ message : "product not found" })
    }
})

productRouter.put("/update/:_id", async (req,res)=>{
    const product = await Product.findById(req.params._id)
    if(product){
        product.img = req.body.img || product.img
        product.name = req.body.name || product.name
        product.description = req.body.description || product.description
        product.rating = req.body.rating || product.rating
        product.stock = req.body.stock || product.stock
        product.price = req.body.price || product.price

        console.log(product)

        const updateProduct = await product.save()

        res.send({ message: "Product Update",  product: updateProduct})
    }else{
        res.status(404).send({ message : "product not update" })
    }
})

export default productRouter