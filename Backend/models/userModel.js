import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";

export const User = sequelize.define("users", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: "user" 
    },
    password: {
        type: DataTypes.STRING(),
        allowNull: true
    },
    number: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    googleId: {
        type: DataTypes.STRING(),
        allowNull: true
    }
});