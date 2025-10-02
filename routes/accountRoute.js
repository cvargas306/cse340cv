// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/")

router.get("/", utilities.handleErrors(accountController.buildAccountManagementView));

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/registration", utilities.handleErrors(accountController.buildRegister));

router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router;    