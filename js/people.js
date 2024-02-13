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

    const showPeopleButton = document.getElementById('showPeopleButton');
    showPeopleButton.addEventListener('click', () => {
        fetchPeople(token);
    });

    const createPersonButton = document.getElementById('createPersonButton');
    createPersonButton.addEventListener('click', () => {
        document.getElementById('createPersonForm').style.display = 'block';
        document.getElementById('peopleFormSubmitButton').innerText = 'Create';
        document.getElementById('peopleForm').removeAttribute('data-people-id');
    });

    const peopleForm = document.getElementById('peopleForm');
    peopleForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const personId = peopleForm.getAttribute('data-people-id');
        if (personId) {
            updatePerson(token);
        } else {
            createPerson(token);
        }
    });

    const deletePeopleButton = document.getElementById('deletePeopleButton');
    deletePeopleButton.addEventListener('click', () => {
        const personId = document.getElementById('peopleForm').getAttribute('data-people-id');
        if (personId) {
            deletePerson(token, personId);
        }
    });
});

function fetchPeople(token) {
    const showPeopleButton = document.getElementById('showPeopleButton');
    const value = showPeopleButton.getAttribute('data-value');
    fetch(`${BASE_URL}/people/all/${value}`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch people');
            }
            return response.json();
        })
        .then(data => {
            const peopleListBody = document.getElementById('peopleListBody');
            peopleListBody.innerHTML = '';

            data.forEach(people => {
                const row = document.createElement('tr');

                const nameCell = document.createElement('td');
                nameCell.textContent = people.name;
                row.appendChild(nameCell);

                const emailCell = document.createElement('td');
                emailCell.textContent = people.email;
                row.appendChild(emailCell);

                const addressCell = document.createElement('td');
                addressCell.textContent = people.address;
                row.appendChild(addressCell);

                const phoneNumberCell = document.createElement('td');
                phoneNumberCell.textContent = people.phoneNumber;
                row.appendChild(phoneNumberCell);

                const editCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    fillPeopleForm(people);
                });
                editCell.appendChild(editButton);
                row.appendChild(editCell);

                const deleteCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deletePerson(token, people.id);
                });
                deleteCell.appendChild(deleteButton);
                row.appendChild(deleteCell);

                peopleListBody.appendChild(row);
            });

            document.getElementById('peopleInfoContainer').style.display = 'block';
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}


function fillPeopleForm(person) {
    document.getElementById('personName').value = person.name;
    document.getElementById('personEmail').value = person.email;
    document.getElementById('personAddress').value = person.address;
    document.getElementById('personPhoneNumber').value = person.phoneNumber;

    document.getElementById('peopleForm').setAttribute('data-people-id', person.id);
    document.getElementById('createPersonForm').style.display = 'block';
    document.getElementById('peopleFormSubmitButton').innerText = 'Update';
}

function createPerson(token) {
    const name = document.getElementById('personName').value;
    const email = document.getElementById('personEmail').value;
    const address = document.getElementById('personAddress').value;
    const phoneNumber = document.getElementById('personPhoneNumber').value;

    const requestBody = {
        name: name,
        email: email,
        address: address,
        phoneNumber: phoneNumber
    };

    fetch(`${BASE_URL}/people`, {
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

            document.getElementById('peopleForm').reset();
            document.getElementById('createPersonForm').style.display = 'none';
            fetchPeople(token);
        })
        .then(errorData => {
            console.log('Response Text:', errorData);
            throw new Error('Failed to create people: ' + errorData);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function updatePerson(token) {
    const personId = document.getElementById('peopleForm').getAttribute('data-people-id');
    const name = document.getElementById('personName').value;
    const email = document.getElementById('personEmail').value;
    const address = document.getElementById('personAddress').value;
    const phoneNumber = document.getElementById('personPhoneNumber').value;
    const personType = document.getElementById('personType').value;

    const requestBody = {
        id: personId,
        name: name,
        email: email,
        address: address,
        phoneNumber: phoneNumber,
        personType: personType
    };

    fetch(`${BASE_URL}/people`, {
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

            document.getElementById('peopleForm').reset();
            document.getElementById('createPersonForm').style.display = 'none';
            fetchPeople(token);
        })
        .then(errorData => {
            console.log('Response Text:', errorData);
            // throw new Error('Failed to update people: ' + errorData);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function deletePerson(token, peopleId) {
    fetch(`${BASE_URL}/people/${peopleId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete people');
            }
            const showPeopleButton = document.getElementById('showPeopleButton');
            fetchPeople(token);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}