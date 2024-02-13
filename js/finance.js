import BASE_URL from './main.js';

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('dateRangeForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token is not available');
            return;
        }

        const url = new URL(`http://localhost:8080/api/finance/totalprofit`);
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);
        console.log(url);
        fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch total profit');
                }

                return response.json();
            })
            .then(data => {
                if (!data.hasOwnProperty('profit')) {
                    throw new Error('Profit value not found in response');
                }

                const totalProfit = data.profit;
                window.alert(`Total profit from ${startDate} to ${endDate} is ${totalProfit} leva`);
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
    });
});
