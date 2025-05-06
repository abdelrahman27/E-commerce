import { Schema,Types , model } from "mongoose";

const productSchema = new Schema({

    name: {type:String , required: true },
    slug: {type:String , required: true},
    description:{type:String , required: true},
    stock:{type: Number , required: true , default: 1},
    price:{type: Number , required: true , default: 0},
    discount:{type: Number , default: 0},
    paymentPrice:{type:Number , required:true , default:0},
    color:{type:Array },
    size:{type:Array },
    coverImages:{type:Array },
    image:{type:Object , required:true},
    categoryId:{type:Types.ObjectId , ref : 'Category' , required :true},
    subcategoryId:{type:Types.ObjectId , ref : 'Subcategory' , required :true},
    brandId:{type:Types.ObjectId , ref : 'Brand' , required: true},
    avgRate:{type:Number , default: 0},
    sold:{type:Number , default: 0},
    QRcode:{type:Object}
    
},
{
    timestamps: true
})


const productModel = model('Product' , productSchema)

export default productModel