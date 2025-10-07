// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/add-classification", utilities.checkAuthorizationManager, utilities.handleErrors(invController.buildAddClassification));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to management view
router.get("/", utilities.checkAuthorizationManager, utilities.handleErrors(invController.buildManagement));

router.get("/add-inventory", utilities.checkAuthorizationManager, utilities.handleErrors(invController.buildAddInventory));

// Route to display edit inventory view
router.get("/edit/:inv_id", utilities.checkAuthorizationManager, utilities.handleErrors(invController.buildEditInventory));

router.post("/edit-inventory", utilities.checkAuthorizationManager, invValidate.inventoryRules(), invValidate.checkUpdateData, utilities.handleErrors(invController.updateInventory));

// Delete vehicle information routes
router.get("/delete/:inv_id", utilities.checkAuthorizationManager, utilities.handleErrors(invController.buildDeleteInventory));
router.post("/delete/", utilities.checkAuthorizationManager, utilities.handleErrors(invController.deleteInventory));

// Validation to POST routes
router.post(
  "/add-classification", 
  utilities.checkAuthorizationManager,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.processAddClassification)
);

router.post(
  "/add-inventory", 
  utilities.checkAuthorizationManager,
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.processAddInventory)
);

router.get("/getInventory/:classification_id", utilities.checkAuthorizationManager, utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;