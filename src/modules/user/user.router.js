import { Router } from "express";
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import * as Val from "./user.validation.js"
import * as userController from "./controller/user.js"
import { asyncHandler } from "../../utils/errorHandling.js";
const router = Router()



router.post('/sign-up',
    fileUpload(fileValidation.image).single("image"),
    validation(Val.signUpValidation),
    asyncHandler(userController.signUp)
    )

router.patch('/confirm-email',
    validation(Val.confirmEmailValid),
    asyncHandler(userController.confirmEmail)
    )

router.post('/login',
    validation(Val.logInValid),
    asyncHandler(userController.login)
    )

router.post('/send-Code',
    validation(Val.sendCode),
    asyncHandler(userController.sendCode)
    )

router.patch('/forget-password',
    validation(Val.forgetPassword),
    asyncHandler(userController.forgetPassword)
    )

export default router