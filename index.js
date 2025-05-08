import express from "express";
import mysql from "mysql2";
import cors from "cors";
import db from './models/index.js'; 
import dotenv from 'dotenv';
import authRoute from "./routes/authRoute.js";
import employeeRoute from "./routes/employeeRoute.js";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/auth', authRoute); 
app.use('/employees', employeeRoute); 


db.sequelize.sync().then(() => {
    app.listen(5000, () => console.log('App is Running on port 5000'));
    console.log('Database & tables created!');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
