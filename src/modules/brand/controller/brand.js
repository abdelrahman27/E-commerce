import slugify from "slugify"
import brandModel from "../../../../DB/model/Brand.model.js"
import cloudinary from "../../../utils/cloudinary.js"
import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';
import { ErrorClass } from "../../../utils/errorClass.js";


export const addBrand = async (req,res,next)=>{
    let {name} = req.body
    name = name.toLowerCase()
    const isExist = await brandModel.findOne({name})
    if(isExist){
        return next(new ErrorClass('this name is exist'))
    }
    const {secure_url, public_id} = await cloudinary.uploader.upload(req.file.path, {folder:'E-commerce/brand'})
    const addBrand = await brandModel.create({
        name,
        slug: slugify(name),
        logo:{
            secure_url,public_id
        }
    })
    res.status(StatusCodes.CREATED).json({message:'done' , addBrand, status:ReasonPhrases.CREATED})
}


export const updateBrand = async(req,res,next)=>{
    const {brandId} = req.params
    const brandExist = await brandModel.findById(brandId)
    if(!brandExist){
        return next(new ErrorClass('brand not exist'))
    }

    if(req.body.name){
        req.body.name = req.body.name.toLowerCase()
    const nameExist = await brandModel.findOne({name: req.body.name , _id : {$ne:brandId}})
    if(nameExist){
        return next(new ErrorClass('name already Exist'))
        }
    req.body.slug=slugify(req.body.name)
    }
    
    if(req.file){
        await cloudinary.uploader.destroy(brandExist.logo.public_id)
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path, {folder:'E-commerce/brand'})   
        req.body.logo = {secure_url , public_id}
    }
    const updateBrand = await brandModel.updateOne({_id: brandId},req.body)
    res.status(StatusCodes.OK).json({message:'done' , updateBrand , staus: ReasonPhrases.OK})
}



export const getAllBrands = async(req,res)=>{
    const allBrands = await brandModel.find()
    res.status(StatusCodes.OK).json({message:'done' , allBrands , status : ReasonPhrases.OK})
}