import BASE_URL from './main.js';

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = '/dashboard.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'EMPLOYEE') {
        window.location.href = 'index.html';
        return;
    }

    const showCompanysButton = document.getElementById('showCompanysButton');
    showCompanysButton.addEventListener('click', () => {
        fetchCompanies(token);
    });

    const createCompanyButton = document.getElementById('createCompanyButton');
    createCompanyButton.addEventListener('click', () => {
        document.getElementById('createCompanyForm').style.display = 'block';
        document.getElementById('companyFormSubmitButton').innerText = 'Create';
        document.getElementById('companyForm').removeAttribute('data-company-id');
    });

    const companyForm = document.getElementById('companyForm');
    companyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const companyId = companyForm.getAttribute('data-company-id');
        if (companyId) {
            updateCompany(token);
        } else {
            createCompany(token);
        }
    });

    const deleteCompanyButton = document.getElementById('deleteCompanyButton');
    deleteCompanyButton.addEventListener('click', () => {
        const companyId = document.getElementById('companyForm').getAttribute('data-company-id');
        if (companyId) {
            deleteCompany(token, companyId);
        }
    });
});

function fetchCompanies(token) {
    fetch(`${BASE_URL}/company/all`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch companies');
            }
            return response.json();
        })
        .then(data => {
            const companyListBody = document.getElementById('companyListBody');
            companyListBody.innerHTML = '';

            data.forEach(company => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = company.name;
                row.appendChild(nameCell);

                const editCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    fillCompanyForm(company);
                });
                editCell.appendChild(editButton);
                row.appendChild(editCell);

                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteCompany(token, company.id);
                });
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                companyListBody.appendChild(row);
            });

            document.getElementById('companyInfoContainer').style.display = 'block';
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}


function fillCompanyForm(company) {
    document.getElementById('companyName').value = company.name;
    document.getElementById('companyForm').setAttribute('data-company-id', company.id);
    document.getElementById('createCompanyForm').style.display = 'block';
    document.getElementById('companyFormSubmitButton').innerText = 'Update';
}

function createCompany(token) {
    const name = document.getElementById('companyName').value;

    const requestBody = {
        name: name
    };

    fetch(`${BASE_URL}/company`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                return response.text();
            }

            document.getElementById('companyForm').reset();
            document.getElementById('createCompanyForm').style.display = 'none';
            fetchCompanies(token);
        })
        .then(errorData => {
            console.log('Response Text:', errorData);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function updateCompany(token) {
    const companyId = document.getElementById('companyForm').getAttribute('data-company-id');
    const name = document.getElementById('companyName').value;
    const requestBody = {
        id: companyId,
        name: name
    };

    fetch(`${BASE_URL}/company`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(requestBody)
    })
        .then(response => {
            if (!response.ok) {
                return response.text();
            }

            document.getElementById('companyForm').reset();
            document.getElementById('createCompanyForm').style.display = 'none';
            fetchCompanies(token);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function deleteCompany(token, companyId) {
    fetch(`${BASE_URL}/company/${companyId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete company');
            }
            fetchCompanies(token);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}