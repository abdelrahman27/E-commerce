import CryptoJS  from "crypto-js"
import userModel from "../../../../DB/model/User.model.js"
import { ErrorClass } from "../../../utils/errorClass.js"
import { hash ,compareWithoutHashing, compare} from "../../../utils/HashAndCompare.js"
import cloudinary from "../../../utils/cloudinary.js"
import { customAlphabet } from "nanoid"
import sendEmail, { createHtml } from "../../../utils/email.js"
import { StatusCodes ,ReasonPhrases} from "http-status-codes"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'






export const signUp = async(req,res,next)=>{
    let {userName ,email ,password ,cPassword ,phone ,DOB} = req.body
    const isEmailExist = await userModel.findOne({email})
    if (isEmailExist) {
        return next(new ErrorClass(`this email "${email}" is already exist`,StatusCodes.CONFLICT))
    }
    const isEqual = compareWithoutHashing(password,cPassword)
    if (!isEqual) {
        return next(new ErrorClass(`the password and cPassword not equal`,StatusCodes.CONFLICT))
    }
    password = hash({plaintext:password})
    phone = CryptoJS.AES.encrypt(phone , process.env.KEY_ENCRYPTION).toString()

    const {secure_url , public_id} = await cloudinary.uploader.upload((req.file?.path),{folder:"E-commerce/user"})
    const num = customAlphabet("0123456789",6)
    const code = num()
    const html =createHtml(code)
    sendEmail(email,"confirm your email",html)



    const saveUser = await userModel.create({
        userName,
        email ,
        password ,
        cPassword ,
        phone ,
        code,
        DOB:new Date(DOB),
        image:{secure_url , public_id},
        
    })
    return res.status(StatusCodes.CREATED).json({message:"done",saveUser,status:ReasonPhrases.CREATED})

    
}

export const confirmEmail = async(req,res,next)=>{
    const {email, code}= req.body
    console.log(email);
    const isEmailExist = await userModel.findOne({email})
    if(!isEmailExist){
        return next(new ErrorClass('this email not exist' ,StatusCodes.NOT_FOUND))
    }
    if(isEmailExist.confirmEmail){
        return next(new ErrorClass('email already confirmed',StatusCodes.CONFLICT))
    }
    if (code != isEmailExist.code) {
        return next(new ErrorClass('invalide code',StatusCodes.NOT_ACCEPTABLE))
    }f3r
    const num = customAlphabet("1234567890=NDLOIUYTREQWASDC",6)
    const codeAfterConfirm = num()
    const confirmEmail = await userModel.updateOne({_id:isEmailExist._id},{confirmEmail:true ,code:codeAfterConfirm})
    res.status(StatusCodes.OK).json({message:'done',confirmEmail,status:ReasonPhrases.OK})
}

export const login = async(req,res,next)=>{

    const{email,password} = req.body
    const isEmailExist = await userModel.findOne({email})
    if(!isEmailExist){
        return next(new ErrorClass('invalid userName or password',StatusCodes.BAD_REQUEST))
    }
    const checkPassword = bcrypt.compareSync(password,isEmailExist.password)
    if (!checkPassword) {
        return next(new ErrorClass('invalid userName or password',StatusCodes.BAD_REQUEST))
    }

    const payload = {
        email,
        id:isEmailExist._id
    }
    const token = jwt.sign(payload , process.env.TOKEN_SIGNATURE,{expiresIn:60})
    res.status(StatusCodes.CREATED).json({message:'done',token,status:ReasonPhrases.CREATED})

}

export const sendCode = async(req,res,next)=>{

    const {email}=req.body
    const isEmailExist = await userModel.findOne({email})
    if (!isEmailExist) {
        return next(new ErrorClass("email is not found", StatusCodes.BAD_REQUEST))
    }
    const code = parseInt(Math.random()*1000000)
    const html = createHtml(code)
    sendEmail(email,"Code For Forgetting Password",html)
    await userModel.updateOne({_id:isEmailExist._id},{code})
    res.status(StatusCodes.OK).json({message:"Done.....Check Your Email",sttus:ReasonPhrases.OK})
    
}

export const forgetPassword = async(req,res,next)=>{

    let{password ,code}=req.body
    const{email}=req.body
    const isEmailExist = await userModel.findOne({email})
    if (!isEmailExist) {
        return next(new ErrorClass("email is not found", StatusCodes.BAD_REQUEST))
    }
    if (code != isEmailExist.code ) {
        return next(new ErrorClass("Code Is Wrong", StatusCodes.BAD_REQUEST))
    }
    console.log(1);
    const value = bcrypt.compareSync({plaintext:password,hashValue:isEmailExist.password})
    console.log(value);
    if (value) {
        return next(new ErrorClass("Enter New Password This Password Was The Old One", StatusCodes.NOT_ACCEPTABLE))
    }
    password = bcrypt.hashSync(password , -process.env.SALT_ROUND)
    const newCode = parseInt(Math.random()*1000000)
    await userModel.updateOne({email},{password,code:newCode})
    res.status(StatusCodes.OK).json({message:"Password Updated Successfully...GO AND TRY LOGIN",status:ReasonPhrases.ok})
}