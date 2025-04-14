import { Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/user.scheema";
import { HttpStatusCode } from "../utils/enums";
import { AuthRequest } from "../utils/interface";
import {
  PROFILE_MESSAGES,
  ALLOWED_PREFERENCES,
} from "../constants/profile.constants";

// ----------------- Update Profile -----------------
export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: PROFILE_MESSAGES.INVALID_USER_ID,
      });
    }

    const { name, mobile, dob, image, preferences } = req.body;

    console.log(req.body);
    

    if (
      preferences &&
      !preferences.every((pref: string) => ALLOWED_PREFERENCES.includes(pref))
    ) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({
        message: PROFILE_MESSAGES.INVALID_PREFERENCES,
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(mobile && { mobile }),
        ...(dob && { dob }),
        ...(image && { image }),
        ...(preferences && { preferences }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: PROFILE_MESSAGES.USER_NOT_FOUND,
      });
    }

    res.status(HttpStatusCode.OK).json({
      message: PROFILE_MESSAGES.PROFILE_UPDATED,
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// ----------------- Change Password -----------------
export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
  
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: PROFILE_MESSAGES.INVALID_USER_ID,
        });
      }
  
      const { currentPassword, newPassword } = req.body;
      console.log("req body",req.body);
      
  
      if (!currentPassword || !newPassword) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: 'Current and new passwords are required',
        });
      }
  
      const user = await User.findById(userId).select('+password'); // make sure password is selected
  
      console.log("user",user);
      if (!user) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: PROFILE_MESSAGES.USER_NOT_FOUND,
        });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      console.log("is match",isMatch);

      if (!isMatch) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: PROFILE_MESSAGES.INCORRECT_CURRENT_PASSWORD,
        });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      console.log("hashed password",hashedPassword);
      
      user.password = hashedPassword;
  
      await user.save();
  
      return res.status(HttpStatusCode.OK).json({
        message: PROFILE_MESSAGES.PASSWORD_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  };
  
