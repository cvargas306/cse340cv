const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* **********************************
 *  Service Request Validation Rules
 * ********************************* */
validate.requestRules = () => {
  return [
    // Subject is required
    body("request_subject")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 5, max: 100 })
      .withMessage("Subject must be between 5 and 100 characters."),

    // Message is required
    body("request_message")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 20, max: 1000 })
      .withMessage("Message must be between 20 and 1000 characters."),

    // Request type must be valid
    body("request_type")
      .trim()
      .notEmpty()
      .isIn(['inquiry', 'service', 'financing', 'other'])
      .withMessage("Please select a valid request type."),

    // inv_id is optional but must be integer if provided
    body("inv_id")
      .optional({ nullable: true, checkFalsy: true })
      .isInt()
      .withMessage("Invalid vehicle ID."),
  ]
}

/* **********************************
 *  Staff Response Validation Rules
 * ********************************* */
validate.responseRules = () => {
  return [
    // Staff response is required
    body("staff_response")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10, max: 1000 })
      .withMessage("Response must be between 10 and 1000 characters."),

    // Status must be valid
    body("request_status")
      .trim()
      .notEmpty()
      .isIn(['in-progress', 'closed'])
      .withMessage("Please select a valid status."),
  ]
}

/* ******************************
 * Check request data and return errors or continue
 * ***************************** */
validate.checkRequestData = async (req, res, next) => {
  const { request_subject, request_message, request_type, inv_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("service/request-form", {
      errors,
      title: "Submit Service Request",
      nav,
      request_subject,
      request_message,
      request_type,
      inv_id: inv_id || null,
    })
    return
  }
  next()
}

/* ******************************
 * Check response data and return errors or continue
 * ***************************** */
validate.checkResponseData = async (req, res, next) => {
  const { staff_response, request_status, request_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const serviceModel = require("../models/service-model")
    const requestData = await serviceModel.getRequestById(request_id)
    res.render("service/respond-form", {
      errors,
      title: "Respond to Request",
      nav,
      request: requestData,
      staff_response,
      request_status,
    })
    return
  }
  next()
}

module.exports = validate