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

    const showOfficesButton = document.getElementById('showOfficesButton');
    showOfficesButton.addEventListener('click', () => {
        fetchOffices(token);
    });

    const createOfficeButton = document.getElementById('createOfficeButton');
    createOfficeButton.addEventListener('click', () => {
        document.getElementById('createOfficeForm').style.display = 'block';
        document.getElementById('officeFormSubmitButton').innerText = 'Create';
        document.getElementById('officeForm').removeAttribute('data-office-id');
    });

    const officeForm = document.getElementById('officeForm');
    officeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const officeId = officeForm.getAttribute('data-office-id');
        if (officeId) {
            updateOffice(token);
        } else {
            createOffice(token);
        }
    });

    const deleteOfficeButton = document.getElementById('deleteOfficeButton');
    deleteOfficeButton.addEventListener('click', () => {
        const officeId = document.getElementById('officeForm').getAttribute('data-office-id');
        if (officeId) {
            deleteOffice(token, officeId);
        }
    });
});

function fetchOffices(token) {
    fetch(`${BASE_URL}/office/all`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch offices');
            }
            return response.json();
        })
        .then(data => {
            const officeListBody = document.getElementById('officeListBody');
            officeListBody.innerHTML = '';

            data.forEach(office => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = office.name;
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = office.email;
                row.appendChild(emailCell);

                const addressCell = document.createElement('td');
                addressCell.textContent = office.address;
                row.appendChild(addressCell);

                const phoneNumberCell = document.createElement('td');
                phoneNumberCell.textContent = office.phoneNumber;
                row.appendChild(phoneNumberCell);

                const editCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    fillOfficeForm(office);
                });
                editCell.appendChild(editButton);
                row.appendChild(editCell);

                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deleteOffice(token, office.id);
                });
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                officeListBody.appendChild(row);
            });

            document.getElementById('officeInfoContainer').style.display = 'block';
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function fillOfficeForm(office) {
    document.getElementById('officeName').value = office.name;
    document.getElementById('officeEmail').value = office.email;
    document.getElementById('officeAddress').value = office.address;
    document.getElementById('officePhoneNumber').value = office.phoneNumber;

    document.getElementById('officeForm').setAttribute('data-office-id', office.id);
    document.getElementById('createOfficeForm').style.display = 'block';
    document.getElementById('officeFormSubmitButton').innerText = 'Update';
}

function createOffice(token) {
    const name = document.getElementById('officeName').value;
    const email = document.getElementById('officeEmail').value;
    const address = document.getElementById('officeAddress').value;
    const phoneNumber = document.getElementById('officePhoneNumber').value;

    const requestBody = {
        name: name,
        email: email,
        address: address,
        phoneNumber: phoneNumber
    };

    fetch(`${BASE_URL}/office`, {
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

            document.getElementById('officeForm').reset();
            document.getElementById('createOfficeForm').style.display = 'none';
            fetchOffices(token);
        })
        .then(errorData => {
            console.log('Response Text:', errorData);
            // throw new Error('Failed to create office: ' + errorData);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function updateOffice(token) {
    const officeId = document.getElementById('officeForm').getAttribute('data-office-id');
    const name = document.getElementById('officeName').value;
    const email = document.getElementById('officeEmail').value;
    const address = document.getElementById('officeAddress').value;
    const phoneNumber = document.getElementById('officePhoneNumber').value;

    const requestBody = {
        id: officeId,
        name: name,
        email: email,
        address: address,
        phoneNumber: phoneNumber
    };

    fetch(`${BASE_URL}/office`, {
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

            document.getElementById('officeForm').reset();
            document.getElementById('createOfficeForm').style.display = 'none';
            fetchOffices(token);
        })
        .then(errorData => {
            console.log('Response Text:', errorData);
            // throw new Error('Failed to update office: ' + errorData);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function deleteOffice(token, officeId) {
    fetch(`${BASE_URL}/office/${officeId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete office');
            }
            fetchOffices(token);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}
