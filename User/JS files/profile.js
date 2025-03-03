const initialProfile = {
    name: 'Ajith Kumar',
    email: 'ajithkumar@gmail.com',
    mobile: '9876543210',
    address: '10-A, Main St, Chennai'
};

const transactions = [
    { id: 1, date: '2024-02-24', amount: 50, plan: 'Monthly Data Pack', validity: '30 days', data: '100 GB', voice: '300 min' },
    { id: 2, date: '2024-02-20', amount: 20, plan: 'Weekly Voice Pack', validity: '7 days', data: '10 GB', voice: '100 min' },
    { id: 3, date: '2024-02-15', amount: 10, plan: 'Daily Internet Pack', validity: '1 day', data: '2 GB', voice: '30 min' }
];

const planDetails = {
    'Monthly Data Pack': {
        description: 'Unlimited data and voice calls for 30 days',
        features: ['100 GB high-speed data', '300 minutes of voice calls', 'Free SMS', 'Access to premium content'],
        expiryDate: calculateExpiryDate('2024-02-24', 30),
        dataRemaining: '68 GB',
        voiceRemaining: '215 min'
    },
    'Weekly Voice Pack': {
        description: 'Voice-focused package for 7 days',
        features: ['10 GB high-speed data', '100 minutes of voice calls', 'Free SMS within network'],
        expiryDate: calculateExpiryDate('2024-02-20', 7),
        dataRemaining: '4 GB',
        voiceRemaining: '45 min'
    },
    'Daily Internet Pack': {
        description: 'Quick internet boost for 24 hours',
        features: ['2 GB high-speed data', '30 minutes of voice calls'],
        expiryDate: calculateExpiryDate('2024-02-15', 1),
        dataRemaining: '0 GB',
        voiceRemaining: '0 min'
    }
};

function calculateExpiryDate(startDate, daysValid) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + daysValid);
    return date.toISOString().split('T')[0];
}

function loadProfileData() {
    const savedProfile = localStorage.getItem('profile');
    const profileData = savedProfile ? JSON.parse(savedProfile) : initialProfile;
    
    document.getElementById('name').value = profileData.name;
    document.getElementById('email').value = profileData.email;
    document.getElementById('mobile').value = profileData.mobile;
    document.getElementById('address').value = profileData.address;
}

function loadTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = transactions.map(transaction => `
        <div class="transaction-item">
            <div>
                <p class="mb-1"><strong>${transaction.plan}</strong></p>
                <p class="mb-1">Date: ${transaction.date}</p>
                <p class="mb-0">Amount: $${transaction.amount}</p>
            </div>
            <button class="btn btn-secondary" onclick="downloadReceipt(${transaction.id})">
                <i class="fas fa-download me-1"></i> Receipt
            </button>
        </div>
    `).join('');
}

function loadCurrentPlan() {
    const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.date) - new Date(a.date)
    );
    
    const latestTransaction = sortedTransactions[0];
    const plan = planDetails[latestTransaction.plan];
    
    const today = new Date();
    const expiryDate = new Date(plan.expiryDate);
    const daysRemaining = Math.max(0, Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24)));
    const isActive = daysRemaining > 0;
    
    const currentPlanElement = document.getElementById('current-plan-details');
    currentPlanElement.innerHTML = `
        <div class="current-plan-card">
            <div class="plan-name">${latestTransaction.plan}</div>
            <p>${plan.description}</p>
            <div class="plan-details">
                <div class="plan-detail">
                    <span>Status:</span>
                    <span style="color: ${isActive ? '#047857' : '#dc2626'}; font-weight: bold;">
                        ${isActive ? 'Active' : 'Expired'}
                    </span>
                </div>
                <div class="plan-detail">
                    <span>Purchased on:</span>
                    <span>${latestTransaction.date}</span>
                </div>
                <div class="plan-detail">
                    <span>Expires on:</span>
                    <span>${plan.expiryDate}</span>
                </div>
                <div class="plan-detail">
                    <span>Days remaining:</span>
                    <span>${daysRemaining} days</span>
                </div>
                <div class="plan-detail">
                    <span>Data remaining:</span>
                    <span>${plan.dataRemaining}</span>
                </div>
                <div class="plan-detail">
                    <span>Voice remaining:</span>
                    <span>${plan.voiceRemaining}</span>
                </div>
            </div>
            <button class="btn btn-primary w-100 mt-3">Renew Plan</button>
        </div>
    `;
    
    const renewBtn = currentPlanElement.querySelector('.btn-primary');
    renewBtn.addEventListener('click', function() {
        alert('Redirecting to renewal page...');
        // window.location.href = 'renew.html?plan=' + encodeURIComponent(latestTransaction.plan);
    });
}

function downloadReceipt(transactionId) {
    const transaction = transactions.find(t => t.id === transactionId);
    const receiptContent = `
        PayNGo Receipt
        Transaction ID: ${transaction.id}
        Date: ${transaction.date}
        Plan: ${transaction.plan}
        Amount: $${transaction.amount}
    `;
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${transactionId}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', function() {
    const editBtn = document.querySelector('.edit-btn');
    const profileInputs = document.querySelectorAll('.profile-field input');
    
    editBtn.addEventListener('click', function() {
        if (editBtn.textContent === 'Edit Profile') {
            profileInputs.forEach(input => input.disabled = false);
            editBtn.textContent = 'Save Changes';
            editBtn.classList.add('save-btn');
        } else {
            profileInputs.forEach(input => input.disabled = true);
            editBtn.textContent = 'Edit Profile';
            editBtn.classList.remove('save-btn');
            const profileData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                mobile: document.getElementById('mobile').value,
                address: document.getElementById('address').value
            };
            localStorage.setItem('profile', JSON.stringify(profileData));
        }
    });

    const feedbackForm = document.getElementById('feedback-form');
    feedbackForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const subject = document.getElementById('feedback-subject').value;
        const message = document.getElementById('feedback-message').value;
        if (subject.trim() === '' || message.trim() === '') {
            alert('Please fill in all fields');
            return;
        }
        alert('Feedback submitted successfully!');
        feedbackForm.reset();
    });

    loadProfileData();
    loadTransactions();
    loadCurrentPlan();
});