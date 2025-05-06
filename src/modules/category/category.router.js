import { Router } from "express";
import * as categoryController from "./controller/category.js";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./category.validation.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import subcategoryRouter from "../subcategory/subcategory.router.js"

const router = Router()

router.route('/')
    .post(
        fileUpload(fileValidation.image).single('image'),
        validation(Val.addCategoryVal),
        asyncHandler(categoryController.addCategory))

    .get(
        validation(Val.findByNameVal),
        asyncHandler(categoryController.findCategoryByName))

router.route('/:categoryId')
    .put(
        fileUpload(fileValidation.image).single('image'),
        validation(Val.updateCategoryVal),
        asyncHandler(categoryController.updateCategory)
    )
    .delete(
        validation(Val.deleteCategoryVal),
        asyncHandler(categoryController.deleteCategory)
    )


router.use('/:categoryId/subcategory',subcategoryRouter)

export default router