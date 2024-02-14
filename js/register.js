import BASE_URL from './main.js';

function handleRegistration(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const personType = document.getElementById("personType").value;

    fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            authDTO: { username, password },
            person: { name, email, address, phoneNumber, personType },
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Registration failed');
            }
            return response.json();
        })
        .then(data => {
            const token = data.token;
            const role = data.role;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('personId', data.personId);

            window.location.href = "dashboard.html";
        })
        .catch(error => {
            if (error.response) {
                error.response.json().then(errorMessage => {
                    document.getElementById("errorMessage").innerText = errorMessage.error;
                });
            } else {
                document.getElementById("errorMessage").innerText = "Registration failed. Please try again later.";
            }
            document.getElementById("errorMessage").style.display = "block";
            console.error('Error:', error);
        });
}

document.getElementById("registerForm").addEventListener("submit", handleRegistration);
