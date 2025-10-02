const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  
  if (!data) {
    const error = new Error("Vehicle not found")
    error.status = 404
    throw error
  }
  
  const detailHTML = await utilities.buildVehicleDetailHTML(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data.inv_year} ${data.inv_make} ${data.inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    detailHTML,
  })
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect
  })
}

// Build add classification view
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null
  })
}

// Build add inventory view
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    errors: null,
    classifications: classificationSelect
  })
}

/* ***************************
 *  Process add classification
 * ************************** */
invCont.processAddClassification = async function (req, res, next) {
  const { classification_name } = req.body
  
  const addResult = await invModel.addClassification(classification_name)
  
  if (addResult) {
    req.flash("notice", `The ${classification_name} classification was successfully added.`)
    let nav = await utilities.getNav() // Rebuild nav to show new classification
    let classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed.")
    let nav = await utilities.getNav()
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name
    })
  }
}

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.processAddInventory = async function (req, res, next) {
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body
  
  const addResult = await invModel.addInventory(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )
  
  if (addResult) {
    req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect
    })
  } else {
    req.flash("notice", "Sorry, adding the vehicle failed.")
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList()
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classifications: classificationSelect,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont