import e from 'express';
import db from '../models/index.js';
import { v4 as uuidv4 } from 'uuid';
const userModal = db.User;
const Employee = db.Employee;
import { Op } from 'sequelize';

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
        const userId = req.userId; // Assuming you have a middleware that sets req.userId
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

export const employDetails = async (req, res) => {
    try {
        const userId = req.userId; // Assuming you have a middleware that sets req.userId
        console.log(userId, '---------userId')
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Employee ID is required' });
        }

        const q = 'SELECT * FROM employeedb.employees WHERE id = ?';
        const [employee] = await db.sequelize.query(q, { replacements: [id] });
        if (!employee || employee.length === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        return res.status(200).json(employee[0]);
    } catch (error) {
        console.error('Error fetching employee details:', error);
        return res.status(500).json({ message: 'Failed to fetch employee details' });
    }
}

export const updateEmployDetails = async (req, res) => {
    try {
        const userId = req.userId; // from auth middleware
        const { id } = req.params;
        const {
            name,
            email,
            phoneNumber,
            joiningDate,
            position,
            salary,
            address,
        } = req.body;

        if (!name || !email || !phoneNumber || !joiningDate || !position || !salary || !address) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const updatedUser = await userModal.findOne({ where: { id: userId } });
        const updatedBy = updatedUser.username;

        // ✅ Find employee
        const employee = await Employee.findByPk(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // ✅ Update employee details
        await employee.update({
            name,
            email,
            phoneNumber,
            joiningDate,
            position,
            salary,
            address,
        });

        // ✅ Push updatedBy into array (helper defined in model)
        await employee.addUpdater(updatedBy); // this will push and save

        return res.status(200).json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error('Error updating employee:----------', error.message);
        return res.status(500).json({ message: 'Failed to update employee' });
    }
};

export const deleteEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id, '----------55555----employee id');
        const employee = await Employee.findOne({ where: { id } });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        console.log(employee, '---------------employee')
        await employee.destroy();
        return res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error.message);
        return res.status(500).json({ message: 'Failed to delete employee' });
    }
};



export const findEmployees = async (req, res) => {
    try {
        console.log('.....search.............searching the data');
        const { search, minSalary, maxSalary } = req.body;
        console.log(search, minSalary, maxSalary, '-----------Incoming Search Data');

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phoneNumber: { [Op.like]: `%${search}%` } },
            ];
        }

        // Salary range
        if (minSalary || maxSalary) {
            whereClause.salary = {};
            if (minSalary) whereClause.salary[Op.gte] = parseFloat(minSalary);
            if (maxSalary) whereClause.salary[Op.lte] = parseFloat(maxSalary);
        }

        const employees = await Employee.findAll({ where: whereClause });
        return res.status(200).json(employees);
    } catch (error) {
        console.error('Error getting employee:', error.message);
        return res.status(500).json({ message: 'Failed to get employee' });
    }
};

