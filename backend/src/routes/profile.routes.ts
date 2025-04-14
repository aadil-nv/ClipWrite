import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authMiddleware } from "../middlewares/authMiddleware";
import { updateProfile ,changePassword} from "../controllers/profile.controller";
import { changePasswordValidator, updateProfileValidator } from "../middlewares/profile.validator";

export const profileRouter = Router();

profileRouter.post("/profile", authMiddleware,updateProfileValidator, validateRequest, updateProfile);
profileRouter.post("/password", authMiddleware,changePasswordValidator, validateRequest, changePassword);


        