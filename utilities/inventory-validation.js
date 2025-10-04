const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/* **********************************
 *  Classification Name Validation Rules
 * ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .isLength({ min: 1 })
      .withMessage("Classification name must be at least 1 character.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
  ]
}

/* **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Make is required.")
      .isLength({ min: 2, max: 50 })
      .withMessage("Make must be 2-50 characters."),
    
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Model is required.")
      .isLength({ min: 2, max: 50 })
      .withMessage("Model must be 2-50 characters."),
    
    body("inv_year")
      .trim()
      .isInt({ min: 1900, max: 2030 })
      .withMessage("Year must be between 1900 and 2030."),
    
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Description is required.")
      .isLength({ min: 2, max: 100 })
      .withMessage("Description must be 2-100 characters."),
    
    body("inv_image")
      .trim()
      .notEmpty()
      .withMessage("Image path is required."),
    
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .withMessage("Thumbnail path is required."),
    
    body("inv_price")
      .trim()
      .isNumeric()
      .withMessage("Price must be numeric."),
    
    body("inv_miles")
      .trim()
      .isInt()
      .withMessage("Miles must be numeric."),
    
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),
    
    body("classification_id")
      .trim()
      .isInt()
      .withMessage("Classification is required.")
  ]
}

/* ******************************
 * Check classification data and return errors
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory data and return errors
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { 
    inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, 
    inv_color, classification_id 
  } = req.body
  
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList(classification_id)
    
    res.render("inventory/add-inventory", {
      errors,
      title: "Add New Vehicle",
      nav,
      classifications,
      inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color
    })
    return
  }
  next()
}

/* ******************************
 * Check Data and returns errors to the edit view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { 
    inv_id, inv_make, inv_model, inv_year, inv_description, 
    inv_image, inv_thumbnail, inv_price, inv_miles, 
    inv_color, classification_id 
  } = req.body
  
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classifications = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit" + itemName,
      nav,
      classifications,
      inv_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles,
      inv_color, classification_id
    })
    return
  }
  next()
}

module.exports = validate