// ไฟล์: login.js

module.exports = function(app, pool) {
    
    // [POST] API สำหรับเช็ค Login
    app.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                return res.status(400).json({ message: 'กรุณากรอก Username และ Password ให้ครบถ้วน' });
            }

            const [users] = await pool.query(
                'SELECT * FROM users WHERE username = ? AND password = ?', 
                [username, password]
            );

            if (users.length > 0) {
                res.status(200).json({ 
                    message: 'เข้าสู่ระบบสำเร็จ!', 
                    userData: { 
                        user_id: users[0].user_id, 
                        username: users[0].username, 
                        full_name: users[0].full_name,
                        role: users[0].role,
                        dept_id: users[0].dept_id
                    } 
                });
            } else {
                res.status(401).json({ message: 'Username หรือ Password ไม่ถูกต้อง' });
            }

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดที่ระบบหลังบ้าน', error: error.message });
        }
    });

};