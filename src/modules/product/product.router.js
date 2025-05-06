import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as productController from "./controller/product.js";
import * as val from "./product.validation.js"



const router = Router()

router.route('/')
    .get(
        asyncHandler(productController.getAllProducts)
    )
    .post(
        fileUpload(fileValidation.image).fields([{name : "image" , maxCount: 1 },{name : "coverImages" , maxCount: 5},]),
        validation(val.addProductVali),
        asyncHandler(productController.addProduct)
    )    




export default router