function redirectToEmployee() {
    window.location.href = "employee.html";
}

function redirectToClient() {
    window.location.href = "client.html";
}

function redirectToPackage() {
    window.location.href = "package.html";
}

function redirectToFinance() {
    window.location.href = "finance.html";
}

function redirectToOffice() {
    window.location.href = "office.html";
}

function redirectToCompany() {
    window.location.href = "company.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem('role');
    if (role === 'EMPLOYEE') {
        document.getElementById('employeeContent').style.display = 'block';
    } else if (role === 'CLIENT') {
        document.getElementById('clientContent').style.display = 'block';
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }

    function logout() {
        localStorage.removeItem('role');
        localStorage.removeItem('token');
        window.location.href = "index.html";
    }

    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', logout);
});
