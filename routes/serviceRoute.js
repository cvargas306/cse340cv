// Needed Resources 
const express = require("express")
const router = new express.Router() 
const serviceController = require("../controllers/serviceController")
const utilities = require("../utilities/")
const serviceValidate = require("../utilities/service-validation")

// Client routes - require login
router.get("/request", utilities.checkLogin, utilities.handleErrors(serviceController.buildRequestForm))

router.post(
  "/request",
  utilities.checkLogin,
  serviceValidate.requestRules(),
  serviceValidate.checkRequestData,
  utilities.handleErrors(serviceController.submitRequest)
)

router.get("/my-requests", utilities.checkLogin, utilities.handleErrors(serviceController.buildMyRequests))

router.get("/detail/:request_id", utilities.checkLogin, utilities.handleErrors(serviceController.buildRequestDetail))

// Staff routes - require Employee/Admin
router.get("/queue", utilities.checkAuthorizationManager, utilities.handleErrors(serviceController.buildRequestQueue))

router.get("/respond/:request_id", utilities.checkAuthorizationManager, utilities.handleErrors(serviceController.buildRespondForm))

router.post(
  "/respond",
  utilities.checkAuthorizationManager,
  serviceValidate.responseRules(),
  serviceValidate.checkResponseData,
  utilities.handleErrors(serviceController.updateRequest)
)

module.exports = router