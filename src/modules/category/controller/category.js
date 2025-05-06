import slugify from "slugify";
import cloudinary from './../../../utils/cloudinary.js';
import categoryModel from "../../../../DB/model/Category.model.js";
import {
    ReasonPhrases,
    StatusCodes
} from 'http-status-codes';
import { ErrorClass } from "../../../utils/errorClass.js";


export const addCategory = async (req, res, next) => {
    let {name}  = req.body
    name = name.toLowerCase();
    const isExist = await categoryModel.findOne({ name })
    if (isExist) {
        return next(new ErrorClass('There Is Already A Category With The Same Name'))
    }
    const slug = slugify(name)
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: 'E-commerce/category' })
    const category = await categoryModel.create({ name,slug, image: { secure_url, public_id } })
    res.status(StatusCodes.CREATED).json({ message: "Done", category, status: ReasonPhrases.CREATED })
}

export const updateCategory = async (req, res , next)=>{
    const { categoryId } = req.params
    
    const getCategoryById = await categoryModel.findById(categoryId)
    if(!getCategoryById){
        return next( new ErrorClass('The Category Not Found.'))
    }
    if (req.body.name) {
        req.body.name = req.body.name.toLowerCase()
    const nameIsExist = await categoryModel.findOne({name: req.body.name , _id: {$ne: categoryId}})
    if(nameIsExist){
        return next(new ErrorClass('This Name Is Not Available'))
    }
    req.body.slug=slugify(req.body.name)
        
    }
    
    if(req.file){
        await cloudinary.uploader.destroy(getCategoryById.image.public_id)
        const {secure_url , public_id} = await cloudinary.uploader.upload(req.file.path , {folder: 'E-commerce/category'})
        req.body.image = {secure_url , public_id}
    }
    const updateCategory = await categoryModel.updateOne({_id: categoryId},
        req.body)
        return res.status(StatusCodes.ACCEPTED).json({message:'done' , updateCategory})

}


export const deleteCategory = async (req, res, next) => {
    const { categoryId } = req.params
    const isExist = await categoryModel.findByIdAndDelete(categoryId)
    if (!isExist) {
        return next(new ErrorClass('not found'))
    }
    await cloudinary.uploader.destroy(isExist.image.public_id)
    
    return res.status(StatusCodes.OK).json({ messageL: "done", status: ReasonPhrases.OK })
}


export const findCategoryByName = async (req,res,next)=>{

    const {searchKey} = req.query
    if (searchKey) {
        const categories = await categoryModel.find({
            name : {
                $regex : `${searchKey}`
            }
        }).populate([{path:'subcategories'}])
        res.status(StatusCodes.ACCEPTED).json({message: 'done', categories})
    }
    const categories = await categoryModel.find().populate([{
        path:'subcategories'
    }])
    res.status(StatusCodes.ACCEPTED).json({message:'done',categories})
    
}