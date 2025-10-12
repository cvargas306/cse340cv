const pool = require("../database/")

/* ***************************
 *  Create new service request
 * ************************** */
async function createServiceRequest(request_subject, request_message, request_type, account_id, inv_id = null) {
  try {
    const sql = `INSERT INTO service_requests 
      (request_subject, request_message, request_type, account_id, inv_id) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`
    const result = await pool.query(sql, [request_subject, request_message, request_type, account_id, inv_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all requests by account_id
 * ************************** */
async function getRequestsByAccountId(account_id) {
  try {
    const sql = `SELECT 
      sr.request_id,
      sr.request_subject,
      sr.request_message,
      sr.request_type,
      sr.request_status,
      sr.request_created,
      sr.request_updated,
      sr.staff_response,
      i.inv_make,
      i.inv_model,
      i.inv_year
    FROM service_requests sr
    LEFT JOIN inventory i ON sr.inv_id = i.inv_id
    WHERE sr.account_id = $1
    ORDER BY sr.request_created DESC`
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get single request by request_id
 * ************************** */
async function getRequestById(request_id) {
  try {
    const sql = `SELECT 
      sr.*,
      i.inv_make,
      i.inv_model,
      i.inv_year,
      a.account_firstname,
      a.account_lastname,
      a.account_email,
      s.account_firstname as staff_firstname,
      s.account_lastname as staff_lastname
    FROM service_requests sr
    LEFT JOIN inventory i ON sr.inv_id = i.inv_id
    LEFT JOIN account a ON sr.account_id = a.account_id
    LEFT JOIN account s ON sr.staff_id = s.account_id
    WHERE sr.request_id = $1`
    const result = await pool.query(sql, [request_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Get all open/in-progress requests (for staff)
 * ************************** */
async function getAllOpenRequests() {
  try {
    const sql = `SELECT 
      sr.request_id,
      sr.request_subject,
      sr.request_type,
      sr.request_status,
      sr.request_created,
      a.account_firstname,
      a.account_lastname,
      a.account_email,
      i.inv_make,
      i.inv_model,
      i.inv_year
    FROM service_requests sr
    JOIN account a ON sr.account_id = a.account_id
    LEFT JOIN inventory i ON sr.inv_id = i.inv_id
    WHERE sr.request_status IN ('open', 'in-progress')
    ORDER BY sr.request_created DESC`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Update request with staff response
 * ************************** */
async function updateRequestStatus(request_id, request_status, staff_response, staff_id) {
  try {
    const sql = `UPDATE service_requests 
      SET request_status = $1, 
          staff_response = $2, 
          staff_id = $3,
          request_updated = CURRENT_TIMESTAMP
      WHERE request_id = $4 
      RETURNING *`
    const result = await pool.query(sql, [request_status, staff_response, staff_id, request_id])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ***************************
 *  Count open requests by account_id
 * ************************** */
async function getOpenRequestCount(account_id) {
  try {
    const sql = `SELECT COUNT(*) as count 
      FROM service_requests 
      WHERE account_id = $1 
      AND request_status = 'open'`
    const result = await pool.query(sql, [account_id])
    return parseInt(result.rows[0].count)
  } catch (error) {
    return 0
  }
}

/* ***************************
 *  Count all open requests (for staff)
 * ************************** */
async function getAllOpenRequestCount() {
  try {
    const sql = `SELECT COUNT(*) as count 
      FROM service_requests 
      WHERE request_status IN ('open', 'in-progress')`
    const result = await pool.query(sql)
    return parseInt(result.rows[0].count)
  } catch (error) {
    return 0
  }
}

module.exports = {
  createServiceRequest,
  getRequestsByAccountId,
  getRequestById,
  getAllOpenRequests,
  updateRequestStatus,
  getOpenRequestCount,
  getAllOpenRequestCount
}