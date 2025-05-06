
import slugify from "slugify";
import categoryModel from "../../../../DB/model/Category.model.js"
import subcategoryModel from "../../../../DB/model/SubCategory.model.js"
import cloudinary from "../../../utils/cloudinary.js";
import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';
import { asyncHandler } from "../../../utils/errorHandling.js";
import { ErrorClass } from "../../../utils/errorClass.js";

export const addSubcategory = async (req,res,next)=>{

    let {name} = req.body
    const {categoryId} = req.body
    const categoryExist= await categoryModel.findById(categoryId)
    if(!categoryExist){
        return next(new ErrorClass('could\'t find category. ' ))
    }
    name = name.toLowerCase()
    const nameExist = await subcategoryModel.findOne({name})
    if(nameExist){
        return next(new ErrorClass('this name is already exist'))
    }
    const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder: 'E-commerce/Subcategory'})
    const addSubcategory = await subcategoryModel.create({
        name,
        categoryId,
        slug:slugify(name),
        image:{
            secure_url , public_id
        }
    })
    res.status(StatusCodes.CREATED).json({ message: "Done", addSubcategory })
}

export const updateSubcategory = async (req,res,next)=>{

    const { subCategoryId } = req.params
    const subcategoryExist = await subcategoryModel.findById(subCategoryId)
    if(!subcategoryExist){
        return next(new ErrorClass('Subcategory Not Founded'))
    }
    if (req.body.name) {
        req.body.name= req.body.name.toLowerCase()
        const nameExist = await subcategoryModel.findOne({name: req.body.name , _id:{$ne : subCategoryId}})
        if (nameExist) {
            return next(new ErrorClass(`this name is already Exist `))
        }
        req.body.slug = slugify(req.body.name) 
    }
    if(req.file){
        await cloudinary.uploader.destroy(subcategoryExist.image.public_id)
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder: 'E-commerce/Subcategory'})
        req.body.image = {secure_url , public_id}
    }
    const updateSubcategory = await subcategoryModel.updateOne({_id:subCategoryId} ,req.body)
    
    res.status(StatusCodes.ACCEPTED).json({message:'done' , updateSubcategory})
}

export const deleteSubcategory = asyncHandler( async (req,res,next)=>{
    const { subcategoryId } = req.params
    const isExist = await subcategoryModel.findByIdAndDelete(subcategoryId)
    if (!isExist) {
        return next(new ErrorClass('subcategory not found'))
    }

    await cloudinary.uploader.destroy(isExist.image.public_id)
   
    return res.status(StatusCodes.OK).json({ messageL:"done" , status:ReasonPhrases.OK })
})



export const getAllSubcatagories = async(req,res)=>{
    console.log(req.params)
    const allSubcategories = await subcategoryModel.find(req.params)
    res.status(StatusCodes.OK).json({message:'OK' , allSubcategories, status:ReasonPhrases.OK})
}