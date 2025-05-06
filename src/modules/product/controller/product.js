import productModel from "../../../../DB/model/Product.model.js"
import slugify from "slugify";
import cloudinary from './../../../utils/cloudinary.js';
import categoryModel from "../../../../DB/model/Category.model.js";
import subcategoryModel from "../../../../DB/model/SubCategory.model.js"
import brandModel from "../../../../DB/model/Brand.model.js"
import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';
import { ErrorClass } from "../../../utils/errorClass.js";
import QRcode from 'qrcode'



export const addProduct = async(req,res,next)=>{

    const nameExist = await productModel.findOne({name:req.body.name})
    if (nameExist) {
        nameExist.stock += Number(req.body.quantity)
        await nameExist.save()
        return res.status(StatusCodes.OK).json({message:'Done' , product :nameExist , status:ReasonPhrases.OK})
    }
    const categoryIsExist = await categoryModel.findById(req.body.categoryId)
    
    if (!categoryIsExist) {
        return next(new ErrorClass("category not found"))
    } 
    const subcategoryIsExist = await subcategoryModel.findOne({_id : req.body.subcategoryId , categoryId:{ $eq : req.body.categoryId}})
    if (!subcategoryIsExist) {
        return next(new ErrorClass('subcategory not found OR you may added subcategory ID belong to anthor category '))
    }
    const brandIsExist = await brandModel.findById(req.body.brandId)
    if (!brandIsExist) {
        return next(new ErrorClass('brand not found'))
    }
    req.body.slug = slugify(req.body.name)
    if (req.body.size) {
        req.body.size=JSON.parse(req.body.size)
    }
    if(req.body.color){
        req.body.color= JSON.parse(req.body.color)
    }
    req.body.stock = req.body.quantity
    req.body.paymentPrice = req.body.price - (req.body.price *((req.body.discount || 0 )/100))
    
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.files.image[0].path , {folder:'E-commerce/product/image'})
    req.body.image = {secure_url , public_id}
    if(req.files.coverImages.length){
        const coverImages = []
        for (let i = 0; i < req.files.coverImages.length; i++) {
            const {secure_url , public_id} =await cloudinary.uploader.upload(req.files.coverImages[i].path , {folder:"E-commerce/product/coverImages"})
            coverImages.push({secure_url,public_id})
        }
        req.body.coverImages = coverImages
    }
    req.body.QRcode = await QRcode.toDataURL(JSON.stringify({
        name : req.body.name , 
        description: req.body.description,
        price: req.body.paymentPrice,
    }))
    const addProduct = await productModel.create(req.body)
    res.status(StatusCodes.CREATED).json({message:'done' , addProduct ,status:ReasonPhrases.CREATED })
}


export const getAllProducts = async(req,res,nex)=>{

    const {page , size} = req.query
    if(page<=0 || !page)page = 1
    if(size<=0 || !size)size = 5
    const skip = size * (page-1)
    const getAllProducts = await productModel.find().skip(skip).limit(size)
    res.status(StatusCodes.OK).json({message:'done',getAllProducts,status:ReasonPhrases.OK})
}