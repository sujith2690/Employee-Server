import db from '../models/index.js'; // Import db to access User model
import bcrypt from 'bcryptjs';
import pkg from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();
const userModal = db.User;
const jwt = pkg;

export const signUpUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }
        // Check if user already exists
        const existingUser = await userModal.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists with this email' });
        }
        const username = name
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = await userModal.create({
            username,
            email,
            password: hashedPassword,
        });
        // Success response
        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
            },
        });

    } catch (error) {
        console.log(error, 'signup error');
        return res.status(500).json({ message: 'Error while SignUp' });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill all the fields' });
        }

        const user = await userModal.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log(user.email, '------------------email')
        console.log(user.id, '------------------id')
        const token = jwt.sign(
            {
                email: user.email,
                id: user.id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        return res.status(200).json({
            message: 'Login successful', user:
            {
                id: user.id,
                name: user.username,
                email: user.email,
            }, token
        });

    } catch (error) {
        console.log(error, 'Login error');
        return res.status(500).json({ message: 'Error while Login' });
    }
};
