import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addBrandValidation = {
    body:joi.object().required().keys({
        name: generalFields.name.required()
    }) ,
    file:generalFields.file,
    params:joi.object().required().keys(),
    query:joi.object().required().keys()
}


export const updateBrandVali = {
    body: joi.object().required().keys({
        name : generalFields.name
    }),
    file:generalFields.file,
    query: joi.object().required().keys(),
    params: joi.object().required().keys({
        brandId : generalFields.id
    })
}