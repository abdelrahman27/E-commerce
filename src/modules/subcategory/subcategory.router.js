import { Router } from "express";
import {fileUpload , fileValidation} from "../../utils/multer.js"
import { validation } from "../../middleware/validation.js";
import * as Val from "./subcategory.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import * as subcategoryController from './controller/subcategory.js'
const router = Router({mergeParams:true})

router.route('/')
    .post(
        fileUpload(fileValidation.image).single("image"),
        validation(Val.addsubCategoryVal),
        asyncHandler(subcategoryController.addSubcategory)
    )
    .get(
        asyncHandler(subcategoryController.getAllSubcatagories)
    )

router.route('/:subCategoryId')
        .put(
            fileUpload(fileValidation.image).single('image'),
            validation(Val.updatesSubCategoryVal),
            asyncHandler(subcategoryController.updateSubcategory)
        )

        .delete(
            validation(Val.deleteSubcategoryVal),
            subcategoryController.deleteSubcategory
        )    

export default router