import { body } from "express-validator";

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .matches(/^\+?[0-9]{10,15}$/)
    .withMessage("Invalid mobile number format"),

  body("dob")
    .notEmpty()
    .withMessage("Date of birth is required")
    .isISO8601()
    .toDate()
    .withMessage("Invalid date format (should be YYYY-MM-DD)"),

  body("preferences")
    .isArray({ min: 1 })
    .withMessage("At least one preference is required")
    .custom((arr: string[]) => {
      const allowed = [
        'travel',
        'food',
        'lifestyle',
        'fitness',
        'technology',
        'gaming',
        'fashion',
        'education',
        'music',
        'daily routine',
      ];
      return arr.every((pref) => allowed.includes(pref));
    })
    .withMessage("One or more preferences are invalid"),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const loginWithMobileValidation = [
  body("password").notEmpty().withMessage("Password is required"),
  body("mobile")
    .notEmpty().withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 }).withMessage("Mobile must be 10 digits")
    .matches(/^\d{10}$/).withMessage("Mobile must contain only numbers")
    .not().isIn(["1234567890", "1111111111"]).withMessage("Invalid mobile number"),
];

export const customerValidation = [
  body("name").trim().notEmpty().withMessage("Customer name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("mobileNumber")
    .trim()
    .isLength({ min: 10, max: 15 })
    .withMessage("Mobile number must be between 10-15 digits")
    .isNumeric()
    .withMessage("Mobile number must be numeric"),
  body("address.street").trim().notEmpty().withMessage("Street is required"),
  body("address.city").trim().notEmpty().withMessage("City is required"),
  body("address.state").trim().notEmpty().withMessage("State is required"),
  body("address.zipCode")
    .trim()
    .isPostalCode("any")
    .withMessage("Invalid zip code"),
  body("address.country").trim().notEmpty().withMessage("Country is required"),
];

export const productValidation = [
  body("productName").trim().notEmpty().withMessage("Product name is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("price")
    .isFloat({ min: 0.01 })
    .withMessage("Price must be a positive number"),
];

export const saleValidation = [
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Invalid date format (use YYYY-MM-DD)"),

  body("products")
    .isArray({ min: 1 })
    .withMessage("At least one product is required"),

  body("products.*.productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid product ID format"),

  body("products.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),

  body("customerId")
    .notEmpty()
    .withMessage("Customer ID is required"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isIn(["Cash", "Online", "Credit Card", "Debit Card", "UPI", "Bank Transfer"])
    .withMessage("Invalid payment method"),
];

export const createBlogValidation = [
  
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required"),

  body("content")
    .notEmpty()
    .withMessage("Content is required"),

  body("author")
    .notEmpty()
    .withMessage("Author is required")
    .withMessage("Invalid author ID"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string"),

  body("preference")
    .notEmpty()
    .withMessage("Preference is required")
    .isIn([
      'travel',
      'food',
      'lifestyle',
      'fitness',
      'technology',
      'gaming',
      'fashion',
      'education',
      'music',
      'daily routine',
    ])
    .withMessage("Invalid preference value"),

    body("image")
    .notEmpty()
    .withMessage("Image is required")
    .isString()
    .withMessage("Image must be a valid string URL"),

  body("isPublished")
    .optional()
    .isBoolean()
    .withMessage("isPublished must be a boolean"),
];