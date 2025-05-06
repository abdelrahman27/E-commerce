import Joi from "joi"
import { generalFields } from "../../middleware/validation.js"




export const signUpValidation = {
    body: Joi.object().required().keys({
        userName: generalFields.name.required(),
        email: generalFields.email.required(),
        password: generalFields.password.required(),
        cPassword: generalFields.cPassword,
        phone: Joi.string(),
        DOB: Joi.date()
    }),
    file: generalFields.file,
    params: Joi.object().required().keys({}),
    query: Joi.object().required().keys({})
}


export const confirmEmailValid = {
    body:Joi.object().required().keys({
        email: generalFields.email,
        code: Joi.number().required(),
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys(),
}


export const logInValid = {
    body:Joi.object().required().keys({
        email:generalFields.email,
        password:generalFields.password
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys()
}


export const sendCode = {

    body:Joi.object().required().keys({
        email:generalFields.email
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys()
}


export const forgetPassword ={

    body:Joi.object().required().keys({
        email:generalFields.email,
        password:generalFields.password,
        code:Joi.number().required()
    }),
    query:Joi.object().required().keys(),
    params:Joi.object().required().keys()
}