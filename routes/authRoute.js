import express from 'express'
import { loginUser, signUpUser } from '../controllers/authController.js';



const authRoute = express.Router()

authRoute.post("/login", loginUser)
authRoute.post('/signUp', signUpUser)



export default authRoute;