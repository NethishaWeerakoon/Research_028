const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employee.controller");

// Add employee details route
router.post("/add-employee-details", employeeController.addEmployeeDetails);

// Update employee details route
router.put("/update-employee-details", employeeController.updateEmployeeDetails);

// Get employee details by userId route
router.get("/get-employee-details/:userId", employeeController.getEmployeeDetails);

module.exports = router;
