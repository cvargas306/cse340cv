// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build vehicle detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInventoryId));

// Route to management view
router.get("/", utilities.handleErrors(invController.buildManagement));

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// POST route to process new classification
router.post("/add-classification", utilities.handleErrors(invController.processAddClassification));

// POST route to process new inventory
router.post("/add-inventory", utilities.handleErrors(invController.processAddInventory));

module.exports = router;