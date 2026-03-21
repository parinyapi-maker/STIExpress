const urlParams = new URLSearchParams(window.location.search);
const parcelId = urlParams.get('id');
const trackingNum = urlParams.get('track');

document.getElementById('showTrack').innerText = trackingNum || 'ไม่ทราบเลขพัสดุ';

async function loadLogs() {
    try {
        const response = await fetch(`http://localhost:3000/parcels/${parcelId}/logs`);
        const logs = await response.json();
        
        const tbody = document.getElementById('logsTableBody');
        tbody.innerHTML = '';
        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" style="text-align: center;">ไม่มีประวัติการอัปเดต</td></tr>';
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement('tr');
            const dateStr = new Date(log.action_time).toLocaleString('th-TH');
            
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td><strong>${log.status}</strong></td>
                <td>${log.remark || '-'}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('logsTableBody').innerHTML = '<tr><td colspan="3" style="text-align: center; color: red;">โหลดข้อมูลไม่สำเร็จ</td></tr>';
    }
}

if (parcelId) {
    loadLogs();
} else {
    document.getElementById('logsTableBody').innerHTML = '<tr><td colspan="3" style="text-align: center;">ไม่พบรหัสพัสดุ</td></tr>';
}