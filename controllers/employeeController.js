import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';

export const getAllEmployees = async (req, res) => {
    try {
        const q = 'SELECT * FROM employeedb.employees';

        const [employees, metadata] = await db.sequelize.query(q);

        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: 'No employees found' });
        }

        return res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        return res.status(500).json({ message: 'Failed to fetch employees' });
    }
};

export const addNewEmploy = async (req, res) => {
    try {
        const {
            name,
            email,
            phoneNumber,
            joiningDate,
            createdBy,
            position,
            salary,
            address
        } = req.body;

        // Validate required fields
        if (!name || !email || !phoneNumber || !joiningDate || !position || !salary || !address || !createdBy) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const id = uuidv4();
        const updatedBy = JSON.stringify([]); // Always an empty array

        const q = `
            INSERT INTO employees 
            (id, name, email, phoneNumber, joiningDate, position, salary, address, createdBy, updatedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id,
            name,
            email,
            phoneNumber,
            joiningDate,
            position,
            salary,
            address,
            createdBy,
            updatedBy
        ];

        await db.sequelize.query(q, { replacements: values });

        return res.status(201).json({ message: 'Employee added successfully' });
    } catch (error) {
        console.error('Error adding employee:', error.message);
        return res.status(500).json({ message: 'Failed to add employee' });
    }
};