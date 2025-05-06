import { Router } from "express";
import { fileValidation , fileUpload } from "../../utils/multer.js";
import {asyncHandler} from "../../utils/errorHandling.js"
import {validation} from "../../middleware/validation.js"
import * as brandController from "./controller/brand.js"
import * as Val from "./brand.validation.js"


const router = Router()

router.route('/')
    .post(
        fileUpload(fileValidation.image).single('logo'),
        validation(Val.addBrandValidation),
        asyncHandler(brandController.addBrand)
    )
    .get(
        asyncHandler(brandController.getAllBrands)
    )

router.route('/:brandId')
    .put(
        fileUpload(fileValidation.image).single('logo'),
        validation(Val.updateBrandVali),
        asyncHandler(brandController.updateBrand)
    )


export default router