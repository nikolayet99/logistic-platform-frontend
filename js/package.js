import BASE_URL from './main.js';

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = '/dashboard.html';
});

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const id = localStorage.getItem('personId');

    if (!token || role !== 'EMPLOYEE') {
        fetchClientPackages(token, id);
    }

    const showPackagesButton = document.getElementById('showPackagesButton');

    const fetchOptionSelect = document.getElementById('fetchOption');
    fetchOptionSelect.addEventListener('change', () => {
        let docValue = document.getElementById('fetchOption').value;
        if (docValue === "ALL" || docValue === "ALLREC" || docValue === "ALLSENT") {
            const personSelect = document.getElementById('personSelect');
            personSelect.innerHTML = '';
        } else {
            fetchPeople(token, docValue);
        }
    });


    showPackagesButton.addEventListener('click', () => {
        const selectedPersonId = document.getElementById('personSelect').value;
        fetchPackages(token, selectedPersonId);
    });

    const createPackageButton = document.getElementById('createPackageButton');
    createPackageButton.addEventListener('click', () => {
        document.getElementById('createPackageForm').style.display = 'block';
        fetchSendersAndReceivers(token);
        fetchEmployees(token);
        fetchOffices(token);
        document.getElementById('packageFormSubmitButton').innerText = 'Create';
        document.getElementById('packageForm').removeAttribute('data-package-id');
    });

    const packageForm = document.getElementById('packageForm');
    packageForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const packageId = packageForm.getAttribute('data-package-id');
        if (packageId) {
            updatePackage(token);
        } else {
            createPackage(token);
        }
    });

    const deletePackageButton = document.getElementById('deletePackageButton');
    deletePackageButton.addEventListener('click', () => {
        const packageId = document.getElementById('packageForm').getAttribute('data-package-id');
        if (packageId) {
            deletePackage(token, packageId);
        }
    });
});

function fetchSendersAndReceivers(token) {
    fetch(`${BASE_URL}/people/all/CLIENT`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch senders');
            }
            return response.json();
        })
        .then(data => {
            const senderSelect = document.getElementById('senderSelect');
            const receiverSelect = document.getElementById('receiverSelect');
            senderSelect.innerHTML = '';
            receiverSelect.innerHTML = '';
            data.forEach(sender => {
                const option = document.createElement('option');
                option.value = sender.id;
                option.textContent = `${sender.name} - ${sender.email}`;
                senderSelect.appendChild(option);
                const option2 = document.createElement('option');
                option2.value = sender.id
                option2.textContent = `${sender.name} - ${sender.email}`;
                receiverSelect.appendChild(option2);
            });
        })
        .catch(error => {
            console.error('Error fetching senders:', error);
        });
}

function fetchEmployees(token) {
    fetch(`${BASE_URL}/people/all/EMPLOYEE`, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }
            return response.json();
        })
        .then(data => {
            const employeeSelect = document.getElementById('employeeSelect');
            employeeSelect.innerHTML = '';
            data.forEach(emlpoyee => {
                const option = document.createElement('option');
                option.value = emlpoyee.id;
                option.textContent = `${emlpoyee.name} - ${emlpoyee.email}`;
                employeeSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error fetching employees:', error);
        });
}

function fetchPeople(token, value) {
    let val = value === "EMPLOYEEREG" ? "EMPLOYEE" : "CLIENT";
    fetch(`${BASE_URL}/people/all/${val}`, {
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
            const personSelect = document.getElementById('personSelect');
            personSelect.innerHTML = '';
            data.forEach(person => {
                const option = document.createElement('option');
                option.value = person.id;
                option.textContent = `${person.name} - ${person.email}`;
                personSelect.appendChild(option);
            });
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

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
            const senderOfficeSelect = document.getElementById('senderOfficeSelect');
            const receiverOfficeSelect = document.getElementById('receiverOfficeSelect');
            senderOfficeSelect.innerHTML = '';
            receiverOfficeSelect.innerHTML = '';
            data.forEach(office => {
                const option = document.createElement('option');
                option.value = office.id;
                option.textContent = `${office.name} - ${office.email}`;
                senderOfficeSelect.appendChild(option);
                const option2 = document.createElement('option');
                option2.value = office.id
                option2.textContent = `${office.name} - ${office.email}`;
                receiverOfficeSelect.appendChild(option2);
            });
        })
        .catch(error => {
            console.error('Error fetching offices:', error);
        });
}

function fetchClientPackages(token, personId) {
    const packageListBody = document.getElementById('packageListBody');
    packageListBody.innerHTML = '';
    let url = `${BASE_URL}/package/all/sent/${personId}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                // throw new Error('Failed to fetch packages');
            }
            return response.json();
        })
        .then(data => {
            const packageListBody = document.getElementById('packageListBody');
            packageListBody.innerHTML = '';

            data.forEach(pack => {
                const row = document.createElement('tr');

                const contentCell = document.createElement('td');
                contentCell.textContent = pack.content;
                row.appendChild(contentCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = pack.price;
                row.appendChild(priceCell);

                const sentCell = document.createElement('td');
                sentCell.textContent = pack.sent;
                row.appendChild(sentCell);

                const receivedCell = document.createElement('td');
                receivedCell.textContent = pack.received;
                row.appendChild(receivedCell);

                const senderCell = document.createElement('td');
                senderCell.textContent = pack.sender.name;
                row.appendChild(senderCell);

                const receiverCell = document.createElement('td');
                receiverCell.textContent = pack.receiver.name;
                row.appendChild(receiverCell);

                packageListBody.appendChild(row);
            });

            document.getElementById('personSelect').style.display = 'none';
            document.getElementById('fetchOption').style.display = 'none';
            document.getElementById('showPackagesButton').style.display = 'none';
            document.getElementById('createPackageButton').style.display = 'none';
            document.getElementById('createPackageForm').style.display = 'none';
            document.querySelector('label[for="personSelect"]').style.display = 'none';
            document.querySelector('label[for="fetchOption"]').style.display = 'none';
            document.querySelector('#packageList th:last-child').remove();
            document.getElementById('packageInfoContainer').style.display = 'block';

        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            // errorMessage.textContent = error.message;
            // errorMessage.style.display = 'block';
        });
}

function fetchPackages(token, personId) {
    const packageListBody = document.getElementById('packageListBody');
    packageListBody.innerHTML = '';
    let docValue = document.getElementById('fetchOption').value;
    let url;
    if (personId === "") {

        url = new URL(`${BASE_URL}/package/all`);
        console.log(url);
        if (docValue === "ALLSENT") {
            url.searchParams.set('sent', true);
        }
        if (docValue === "ALLREC") {
            url.searchParams.set('received', true);
        }
    } else {
        if (docValue === "CLIENTSENT") {
            url = `${BASE_URL}/package/all/sent/${personId}`;
        } else if (docValue === "CLIENTREC") {
            url = `${BASE_URL}/package/all/received/${personId}`;
        } else {
            url = `${BASE_URL}/package/all/registered/${personId}`;
        }
    }

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                // throw new Error('Failed to fetch packages');
            }
            return response.json();
        })
        .then(data => {
            const packageListBody = document.getElementById('packageListBody');
            packageListBody.innerHTML = '';

            data.forEach(pack => {
                const row = document.createElement('tr');

                const contentCell = document.createElement('td');
                contentCell.textContent = pack.content;
                row.appendChild(contentCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = pack.price;
                row.appendChild(priceCell);

                const sentCell = document.createElement('td');
                sentCell.textContent = pack.sent;
                row.appendChild(sentCell);

                const receivedCell = document.createElement('td');
                receivedCell.textContent = pack.received;
                row.appendChild(receivedCell);

                const senderCell = document.createElement('td');
                senderCell.textContent = pack.sender.name;
                row.appendChild(senderCell);

                const receiverCell = document.createElement('td');
                receiverCell.textContent = pack.receiver.name;
                row.appendChild(receiverCell);

                const actionsCell = document.createElement('td');

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', () => {
                    fillPackageForm(pack);
                });
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', () => {
                    deletePackage(token, pack.id);
                });
                actionsCell.appendChild(deleteButton);

                row.appendChild(actionsCell);

                packageListBody.appendChild(row);
            });

            document.getElementById('packageInfoContainer').style.display = 'block';
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            // errorMessage.textContent = error.message;
            // errorMessage.style.display = 'block';
        });
}

function fillPackageForm(pack) {
    document.getElementById('packageName').value = pack.name;
    document.getElementById('packageEmail').value = pack.email;
    document.getElementById('packageAddress').value = pack.address;
    document.getElementById('packagePhoneNumber').value = pack.phoneNumber;

    document.getElementById('packageForm').setAttribute('data-package-id', pack.id);
    document.getElementById('createPackageForm').style.display = 'block';
    document.getElementById('packageFormSubmitButton').innerText = 'Update';
}

function createPackage(token) {
    const content = document.getElementById('contentInput').value;
    const price = document.getElementById('priceInput').value;
    const senderId = document.getElementById('senderSelect').value;
    const receiverId = document.getElementById('receiverSelect').value;
    const employeeId = document.getElementById('employeeSelect').value;
    const senderOfficeId = document.getElementById('senderOfficeSelect').value;
    const receiverOfficeId = document.getElementById('receiverOfficeSelect').value;

    const requestBody = {
        content: content,
        price: parseFloat(price),
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        employeeId: parseInt(employeeId),
        senderOfficeId: parseInt(senderOfficeId),
        receiverOfficeId: parseInt(receiverOfficeId)
    };

    fetch(`${BASE_URL}/package`, {
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

            document.getElementById('packageForm').reset();
            document.getElementById('createPackageForm').style.display = 'none';
            fetchPackages(token);
        })
        .then(errorData => {
            console.log('Response Text:', errorData);
            // throw new Error('Failed to create package: ' + errorData);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function updatePackage(token) {
    const packageId = document.getElementById('packageForm').getAttribute('data-package-id');
    const content = document.getElementById('contentInput').value;
    const price = document.getElementById('priceInput').value;
    const senderId = document.getElementById('senderSelect').value;
    const receiverId = document.getElementById('receiverSelect').value;
    const employeeId = document.getElementById('employeeSelect').value;
    const senderOfficeId = document.getElementById('senderOfficeSelect').value;
    const receiverOfficeId = document.getElementById('receiverOfficeSelect').value;

    const requestBody = {
        id: packageId,
        content: content,
        price: parseDouble(price),
        senderId: parseInt(senderId),
        receiverId: parseInt(receiverId),
        employeeId: parseInt(employeeId),
        senderOfficeId: parseInt(senderOfficeId),
        receiverOfficeId: parseInt(receiverOfficeId)
    };

    fetch(`${BASE_URL}/package`, {
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

            document.getElementById('packageForm').reset();
            document.getElementById('createPackageForm').style.display = 'none';
            fetchPackages(token);
        })
        .then(errorData => {
            console.log('Response Text:', errorData);
            // throw new Error('Failed to update package: ' + errorData);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}

function deletePackage(token, packageId) {
    fetch(`${BASE_URL}/package/${packageId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete package');
            }
            fetchPackages(token);
        })
        .catch(error => {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = error.message;
            errorMessage.style.display = 'block';
        });
}