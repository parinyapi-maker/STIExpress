const userDataString = localStorage.getItem('userData');
if (!userDataString) {
    alert('กรุณาเข้าสู่ระบบก่อน!');
    window.location.href = '../html/login.html';
}
const userData = JSON.parse(userDataString);
document.getElementById('welcomeText').innerText = `สวัสดี, ${userData.full_name}`;
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('userData');
    window.location.href = '../html/login.html';
});

document.getElementById('toggleFormBtn').addEventListener('click', () => {
    const form = document.getElementById('createParcelForm');
    form.classList.toggle('hidden');
});
async function loadDepartments() {
    try {
        const response = await fetch('http://localhost:3000/departments');
        const depts = await response.json();
        const selectDept = document.getElementById('receiverDept');
        
        depts.forEach(dept => {
            const option = document.createElement('option');
            option.value = dept.dept_id;
            option.text = dept.dept_name;
            selectDept.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading departments:', error);
    }
}
async function loadParcels() {
    try {
        const response = await fetch('http://localhost:3000/parcels');
        const parcels = await response.json();
        const tbody = document.getElementById('parcelTableBody');
        tbody.innerHTML = '';

        if (parcels.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">ยังไม่มีรายการพัสดุ</td></tr>';
            return;
        }

        parcels.forEach(p => {
            const tr = document.createElement('tr');
            const dateStr = new Date(p.created_at).toLocaleString('th-TH');
            let statusClass = 'status-pending';
            if (p.current_status === 'Delivered') statusClass = 'status-delivered';

            tr.innerHTML = `
                <td><strong>${p.tracking_number}</strong></td>
                <td>${p.parcel_detail}</td>
                <td>${p.receiver_name}</td>
                <td class="${statusClass}">${p.current_status}</td>
                <td>${dateStr}</td>

                <td>
                <button class="btn-action" onclick="window.location.href='update.html?id=${p.parcel_id}&track=${p.tracking_number}&status=${p.current_status}'">อัปเดต</button>
                <button class="btn-action" style="background-color: #17a2b8; color: white; margin-left: 5px;" onclick="window.location.href='logs.html?id=${p.parcel_id}&track=${p.tracking_number}'">ประวัติ</button>
                </td>`;
                
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading parcels:', error);
    }
}

document.getElementById('createParcelForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const newParcel = {
        tracking_number: document.getElementById('trackingNum').value,
        parcel_detail: document.getElementById('parcelDetail').value,
        sender_id: userData.user_id,
        receiver_dept_id: document.getElementById('receiverDept').value,
        receiver_name: document.getElementById('receiverName').value
    };

    try {
        const response = await fetch('http://localhost:3000/parcels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newParcel)
        });

        if (response.status === 201) {
            alert('สร้างรายการสำเร็จ!');
            document.getElementById('createParcelForm').reset();
            document.getElementById('createParcelForm').classList.add('hidden'); 
            loadParcels();
        } else {
            alert('เกิดข้อผิดพลาดในการบันทึก');
        }
    } catch (error) {
        console.error('Error saving parcel:', error);
    }
});

loadDepartments();
loadParcels();