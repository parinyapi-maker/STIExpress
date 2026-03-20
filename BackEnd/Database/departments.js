module.exports = function(app, pool) {
    app.get('/departments', async (req, res) => {
        try {
            const [results] = await pool.query("SELECT * FROM departments");
            res.status(200).json(results);
        } catch (err) {
            res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error: err.message });
        }
    });

};