import express from 'express'
import { addNewEmploy, deleteEmployeeById, employDetails, findEmployees, getAllEmployees, updateEmployDetails } from '../controllers/employeeController.js';
import authMiddleware from '../middleware/authMiddleware.js';



const employeeRoute = express.Router()

employeeRoute.get("/", authMiddleware, getAllEmployees)
employeeRoute.post("/new", authMiddleware, addNewEmploy)
employeeRoute.get("/:id", authMiddleware, employDetails)
employeeRoute.patch("/:id", authMiddleware, updateEmployDetails)
employeeRoute.delete("/:id", authMiddleware, deleteEmployeeById)

employeeRoute.post("/search", authMiddleware,findEmployees)



export default employeeRoute;