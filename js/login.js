import BASE_URL from './main.js';

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('personId', data.personId);

            window.location.href = "dashboard.html";
        })
        .catch(error => {
            if (error.response) {
                error.response.json().then(errorMessage => {
                    document.getElementById("errorMessage").innerText = errorMessage.error;
                });
            } else {
                document.getElementById("errorMessage").innerText = "Login failed. Please check your credentials.";
            }
            document.getElementById("errorMessage").style.display = "block";
            console.error('Error:', error);
        });
}

document.getElementById("loginForm").addEventListener("submit", handleLogin);
