import { Router } from "express";
import { registerUser, loginWithEmail,loginWithMobile,logoutUser,setNewAccessToken } from "../controllers/auth.controller";
import { registerValidation, loginValidation, loginWithMobileValidation } from "../middlewares/authValidators";
import { validateRequest } from "../middlewares/validateRequest";

export const authRouter = Router();

authRouter.post("/register", registerValidation, validateRequest, registerUser);
authRouter.post("/login-email", loginValidation, validateRequest, loginWithEmail);
authRouter.post("/login-mobile", loginWithMobileValidation, validateRequest, loginWithMobile);
authRouter.post("/logout", validateRequest, logoutUser);
authRouter.post('/refresh-token', validateRequest, setNewAccessToken);
    