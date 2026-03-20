require('dotenv').config();
const mysql = require('mysql2/promise');
const express = require('express');
const cors = require('cors');

const loginAPI = require('./Database/login.js');
const parcelsAPI = require('./Database/parcels.js');
const usersAPI = require('./Database/users.js');
const departmentsAPI = require('./Database/departments.js');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

let pool;

const initDBConnection = async () => {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('เชื่อมต่อฐานข้อมูล STIExpress สำเร็จแล้ว!');
        loginAPI(app, pool); 
        parcelsAPI(app, pool); 
        usersAPI(app, pool);
        departmentsAPI(app, pool);
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:', error.message);
    }
}

app.listen(PORT, async () => {
    await initDBConnection();
    console.log(`Server is running on port ${PORT}`);
});