import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const addsubCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name.required(),
        categoryId: generalFields.id
    }),
    file: generalFields.file,
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

export const updatesSubCategoryVal = {
    body: joi.object().required().keys({
        name: generalFields.name,
    }),
    file: generalFields.file,
    params: joi.object().required().keys({
        subCategoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}

export const deleteSubcategoryVal = {
    body: joi.object().required().keys({}),
    params: joi.object().required().keys({
        subcategoryId: generalFields.id
    }),
    query: joi.object().required().keys({})
}