module.exports = function(app, pool) {

    app.get('/parcels', async (req, res) => {
        try {
            const [results] = await pool.query("SELECT * FROM parcels ORDER BY created_at DESC");
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.post('/parcels', async (req, res) => {
        try {
            const { tracking_number, parcel_detail, sender_id, receiver_dept_id, receiver_name } = req.body;
            const current_status = 'Pending'; 
            const created_at = new Date();

            const [parcelResult] = await pool.query(
                'INSERT INTO parcels (tracking_number, parcel_detail, sender_id, receiver_dept_id, receiver_name, current_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [tracking_number, parcel_detail, sender_id, receiver_dept_id, receiver_name, current_status, created_at]
            );
            const newParcelId = parcelResult.insertId;

            await pool.query(
                'INSERT INTO tracking_logs (parcel_id, status, action_by, action_time, remark) VALUES (?, ?, ?, ?, ?)',
                [newParcelId, current_status, sender_id, created_at, 'สร้างรายการส่งพัสดุ']
            );

            res.status(201).json({ message: 'สร้างรายการพัสดุสำเร็จ', parcel_id: newParcelId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.put('/parcels/:id/status', async (req, res) => {
        try {
            const parcelId = req.params.id;
            const { new_status, action_by, remark } = req.body;
            const action_time = new Date();

            await pool.query('UPDATE parcels SET current_status = ? WHERE parcel_id = ?', [new_status, parcelId]);

            await pool.query(
                'INSERT INTO tracking_logs (parcel_id, status, action_by, action_time, remark) VALUES (?, ?, ?, ?, ?)',
                [parcelId, new_status, action_by, action_time, remark || '']
            );

            res.json({ message: 'อัปเดตสถานะสำเร็จ', new_status: new_status });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    app.get('/parcels/:id/logs', async (req, res) => {
        try {
            const parcelId = req.params.id;
            const [results] = await pool.query("SELECT * FROM tracking_logs WHERE parcel_id = ? ORDER BY action_time ASC", [parcelId]);
            res.json(results);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

};