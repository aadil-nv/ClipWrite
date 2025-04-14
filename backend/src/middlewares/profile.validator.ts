import { body } from "express-validator";

export const updateProfileValidator = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string"),

  body("mobile")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid mobile number"),

  body("dob")
    .optional()
    .isISO8601()
    .withMessage("Invalid date of birth format"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a valid URL"),
];


export const changePasswordValidator = [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
  
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ];
  