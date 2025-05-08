import express from 'express'
import { signUpUser, loginUser } from '../controllers/authController.js';



const authRoute = express.Router()

authRoute.post('/signUp', signUpUser)
authRoute.post("/login", loginUser)



export default authRoute;