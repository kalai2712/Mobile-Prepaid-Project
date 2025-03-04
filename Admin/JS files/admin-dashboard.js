document.addEventListener('DOMContentLoaded', function() {
    const userActivityCanvas = document.getElementById('userActivityChart');
    const salesDistributionCanvas = document.getElementById('salesDistributionChart');

    if (!userActivityCanvas || !salesDistributionCanvas) {
        console.error('Chart canvas elements not found!');
        return;
    }

    const userActivityCtx = userActivityCanvas.getContext('2d');
    const userActivityChart = new Chart(userActivityCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    label: 'Active Users',
                    data: [5200, 5800, 6400, 6800, 7100, 7500, 7800, 8100, 8300, 8500, 8800, 9100],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'New Users',
                    data: [1200, 1100, 1300, 900, 1500, 1700, 1400, 1600, 1800, 1900, 2100, 2300],
                    borderColor: '#3a0ca3',
                    backgroundColor: 'rgba(58, 12, 163, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    const salesDistributionCtx = salesDistributionCanvas.getContext('2d');
    const salesDistributionChart = new Chart(salesDistributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Data Plans', 'Voice Plans', 'Combo Plans', 'Add-ons'],
            datasets: [{
                data: [40, 25, 25, 10],
                backgroundColor: ['#4361ee', '#3a0ca3', '#4895ef', '#4cc9f0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            },
            cutout: '70%'
        }
    });

    document.getElementById('userActivityTimeframe').addEventListener('change', function() {
        userActivityChart.data.datasets[0].data = userActivityChart.data.datasets[0].data.map(value => 
            value * (Math.random() * 0.2 + 0.9)
        );
        userActivityChart.data.datasets[1].data = userActivityChart.data.datasets[1].data.map(value => 
            value * (Math.random() * 0.2 + 0.9)
        );
        userActivityChart.update();
    });

    document.getElementById('salesDistributionTimeframe').addEventListener('change', function() {
        salesDistributionChart.data.datasets[0].data = [
            Math.floor(Math.random() * 30) + 30,
            Math.floor(Math.random() * 20) + 15,
            Math.floor(Math.random() * 20) + 15,
            Math.floor(Math.random() * 10) + 5
        ];
        salesDistributionChart.update();
    });
});