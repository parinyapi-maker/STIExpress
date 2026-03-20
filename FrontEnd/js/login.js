document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: user, password: pass })
        });

        const data = await response.json();

        if (response.status === 200) {
            messageDiv.style.color = "green";
            messageDiv.innerText = "เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าหลัก...";
            localStorage.setItem('userData', JSON.stringify(data.userData));
        } else {
            messageDiv.style.color = "red";
            messageDiv.innerText = " " + data.message;
        }
    } catch (error) {
        messageDiv.style.color = "red";
        messageDiv.innerText = "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้";
        console.error('Error:', error);
    }
});