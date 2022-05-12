import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        category: { type: String, required: true },
        description: { type: String, required: true, },
        price: { type: Number, required: true, },
        quantity: { type: Number, required: true, },
        stock: { type: Number, required: true, },
        reviews: { type: Number, required: true, },
        rating: { type: Number, required: true, },
        img: { type: String, required: true, },
    },
    {
        timestamps: true,
    }
)

const Product = mongoose.model( "Product",productSchema )
export default Product