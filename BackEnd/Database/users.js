module.exports = function(app, pool) {
    app.get('/users', async (req,res) => {
      try {
        const [results] = await pool.query("SELECT * FROM users");
        res.status(200).json(results);
      } catch (error) {
        res.status(500).json({message: "user data error", error: error.message});
      }
    });
    app.post('/users', async (req,res) => {
      try {
        const userData = req.body;
        
        const [results] = await pool.query("INSERT INTO users SET ?", [userData]);
        
        res.status(201).json({
            message: "users insert successfully", 
            insertId: results.insertId
        });
      } catch (error) {
        res.status(500).json({message: "users inserted fail", error: error.message});
      }
    });

};