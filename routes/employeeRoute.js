import express from 'express'
import { addNewEmploy, getAllEmployees } from '../controllers/employeeController.js';



const employeeRoute = express.Router()

employeeRoute.get("/", getAllEmployees)
employeeRoute.post("/new", addNewEmploy)



export default employeeRoute;