const userDataString = localStorage.getItem('userData');
if (!userDataString) {
    alert('กรุณาเข้าสู่ระบบก่อน!');
    window.location.href = '../html/login.html';
}
const userData = JSON.parse(userDataString);
document.getElementById('welcomeText').innerText = `สวัสดี, ${userData.full_name}`;
const urlParams = new URLSearchParams(window.location.search);
const parcelId = urlParams.get('id');
const trackingNum = urlParams.get('track');
const currentStatus = urlParams.get('status');

document.getElementById('showTrack').innerText = trackingNum;
document.getElementById('showStatus').innerText = currentStatus;
function highlightCurrentStatus() {
    const statusEngNames = ['Pending', 'In Transit', 'Delivered'];
    const statusBtnIds = ['pending', 'transit', 'delivered'];
    const index = statusEngNames.indexOf(currentStatus);
    
    if (index !== -1) {
        document.getElementById(`status-${statusBtnIds[index]}`).classList.add('active');
    }
}

highlightCurrentStatus();
async function updateStatus(newStatus) {
    if (newStatus === currentStatus) {
        alert('พัสดุอยู่ในสถานะนี้อยู่แล้วครับ!');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/parcels/${parcelId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                new_status: newStatus, 
                action_by: userData.user_id,
                remark: 'อัปเดตจากระบบจัดการ' 
            })
        });

        if (response.status === 200) {
            alert('อัปเดตสถานะสำเร็จ!');
            window.location.href = 'dashboard.html';
        } else {
            alert('เกิดข้อผิดพลาดในการอัปเดต');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้');
    }
}