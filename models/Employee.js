import { v4 as uuidv4 } from 'uuid';

export default (sequelize, DataTypes) => {
    const Employee = sequelize.define(
        'Employee',
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4, 
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            phoneNumber: {
                type: DataTypes.STRING, // Change to STRING
                allowNull: false,
                validate: {
                    is: /^[+]?(\d.*){3,}$/, // Basic regex to validate phone number format
                },
            },
            address: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            position: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            joiningDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            createdBy: {
                type: DataTypes.STRING,
                allowNull: false, // Set the user who performed the creation
            },
            updatedBy: {
                type: DataTypes.JSON,
                allowNull: true, // Array of user IDs who have updated the record
                defaultValue: [], // Initialize it as an empty array
            },
            salary: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
                validate: {
                    min: 0,
                },
            },
        },
        {
            tableName: 'employees',
            timestamps: false,
        }
    );

    return Employee;
};
