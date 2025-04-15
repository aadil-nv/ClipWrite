import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { authMiddleware } from "../middlewares/authMiddleware";
import { updateProfile ,changePassword ,changePreferences} from "../controllers/profile.controller";
import { changePasswordValidator, updateProfileValidator } from "../middlewares/profile.validator";
import { validatePreferenceChange } from "../middlewares/preferenceValidators";

export const profileRouter = Router();

profileRouter.post("/profile", authMiddleware,updateProfileValidator, validateRequest, updateProfile);
profileRouter.post("/password", authMiddleware,changePasswordValidator, validateRequest, changePassword);
profileRouter.post("/preferences", authMiddleware,validatePreferenceChange, validateRequest,changePreferences );


        