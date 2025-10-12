const utilities = require("../utilities/")
const serviceModel = require("../models/service-model")

const serviceCont = {}

/* ***************************
 *  Build request form view
 * ************************** */
serviceCont.buildRequestForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = req.query.inv_id || null
  
  res.render("service/request-form", {
    title: "Submit Service Request",
    nav,
    errors: null,
    request_subject: "",
    request_message: "",
    request_type: "",
    inv_id: inv_id,
  })
}

/* ***************************
 *  Process service request submission
 * ************************** */
serviceCont.submitRequest = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { request_subject, request_message, request_type, inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  const result = await serviceModel.createServiceRequest(
    request_subject,
    request_message,
    request_type,
    account_id,
    inv_id || null
  )
  
  if (result && result.request_id) {
    req.flash("notice", "Your request has been submitted successfully. We'll respond soon.")
    res.redirect("/service/my-requests")
  } else {
    req.flash("notice", "Sorry, there was an error submitting your request. Please try again.")
    res.status(500).render("service/request-form", {
      title: "Submit Service Request",
      nav,
      errors: null,
      request_subject,
      request_message,
      request_type,
      inv_id: inv_id || null,
    })
  }
}

/* ***************************
 *  Build my requests view (user's request history)
 * ************************** */
serviceCont.buildMyRequests = async function (req, res, next) {
  let nav = await utilities.getNav()
  const account_id = res.locals.accountData.account_id
  
  const requests = await serviceModel.getRequestsByAccountId(account_id)
  
  res.render("service/my-requests", {
    title: "My Service Requests",
    nav,
    errors: null,
    requests: requests,
  })
}

/* ***************************
 *  Build request detail view
 * ************************** */
serviceCont.buildRequestDetail = async function (req, res, next) {
  let nav = await utilities.getNav()
  const request_id = parseInt(req.params.request_id)
  const account_id = res.locals.accountData.account_id
  
  const request = await serviceModel.getRequestById(request_id)
  
  // Check if request exists and user owns it (or is staff)
  if (!request) {
    req.flash("notice", "Request not found.")
    return res.redirect("/service/my-requests")
  }
  
  const isStaff = res.locals.accountData.account_type === "Employee" || 
                  res.locals.accountData.account_type === "Admin"
  
  if (request.account_id !== account_id && !isStaff) {
    req.flash("notice", "You don't have permission to view this request.")
    return res.redirect("/service/my-requests")
  }
  
  res.render("service/request-detail", {
    title: "Request Details",
    nav,
    errors: null,
    request: request,
  })
}

/* ***************************
 *  Build request queue (staff only)
 * ************************** */
serviceCont.buildRequestQueue = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  const requests = await serviceModel.getAllOpenRequests()
  
  res.render("service/request-queue", {
    title: "Service Request Queue",
    nav,
    errors: null,
    requests: requests,
  })
}

/* ***************************
 *  Build respond form (staff only)
 * ************************** */
serviceCont.buildRespondForm = async function (req, res, next) {
  let nav = await utilities.getNav()
  const request_id = parseInt(req.params.request_id)
  
  const request = await serviceModel.getRequestById(request_id)
  
  if (!request) {
    req.flash("notice", "Request not found.")
    return res.redirect("/service/queue")
  }
  
  res.render("service/respond-form", {
    title: "Respond to Request",
    nav,
    errors: null,
    request: request,
    staff_response: "",
    request_status: "in-progress",
  })
}

/* ***************************
 *  Process staff response
 * ************************** */
serviceCont.updateRequest = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { request_id, staff_response, request_status } = req.body
  const staff_id = res.locals.accountData.account_id
  
  const result = await serviceModel.updateRequestStatus(
    request_id,
    request_status,
    staff_response,
    staff_id
  )
  
  if (result && result.request_id) {
    req.flash("notice", "Request updated successfully.")
    res.redirect("/service/queue")
  } else {
    req.flash("notice", "Sorry, there was an error updating the request.")
    const request = await serviceModel.getRequestById(request_id)
    res.status(500).render("service/respond-form", {
      title: "Respond to Request",
      nav,
      errors: null,
      request: request,
      staff_response,
      request_status,
    })
  }
}

module.exports = serviceCont