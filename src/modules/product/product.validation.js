import Joi from "joi";
import { generalFields } from "../../middleware/validation.js";


const array = (value,helper)=>{
    value = JSON.parse(value)
    const valueSchema = Joi.object({
        value: Joi.array().items(Joi.string().alphanum())
    })
    const valueResult = valueSchema.validate({value})
    if(valueResult.error){
        return helper.message(valueResult.error.details)
    }else{
        return true
    }

}

export const addProductVali = {
    body:Joi.object().required().keys({
        name : generalFields.name.required(),
        categoryId : generalFields.id,
        subcategoryId : generalFields.id,
        brandId: generalFields.id,
        quantity: Joi.number().min(0).positive().integer(),
        description: generalFields.name.required(),
        price:Joi.number().required().positive().min(0),
        discount:Joi.number().positive().min(0).max(100),
        size:Joi.custom(array),
        color:Joi.custom(array)

    }),
    files:Joi.object().required().keys({
        image: Joi.array().items(generalFields.file).length(1).required(),
        coverImages: Joi.array().items(generalFields.file).max(5),
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys()
}