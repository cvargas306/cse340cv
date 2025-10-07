// Needed Resources 
const regValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagementView));

router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process logout request
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

router.get("/registration", utilities.handleErrors(accountController.buildRegister));

router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate))

// Update account handlers

router.post(
  "/update",
  regValidate.updateRules(), 
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
  );
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;    