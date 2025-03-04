let transactions = [
    { id: "TX001", user: "Kalai", date: "2025-02-28", amount: 399, type: "recharge", status: "completed" },
    { id: "TX002", user: "Dilip", date: "2025-02-27", amount: 999, type: "subscription", status: "completed" },
    { id: "TX003", user: "Karthi", date: "2025-02-26", amount: 199, type: "data add-on", status: "pending" },
    { id: "TX004", user: "Safi", date: "2025-02-25", amount: 499, type: "recharge", status: "completed" },
    { id: "TX005", user: "Madhav", date: "2025-02-24", amount: 399, type: "subscription", status: "failed" }
];

document.addEventListener('DOMContentLoaded', function() {
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const searchInput = document.getElementById('searchInput');
    const dateFilter = document.getElementById('dateFilter');
    const amountFilter = document.getElementById('amountFilter');
    const refundForm = document.getElementById('refundForm');

    function renderTransactions(transactionList) {
        transactionsTableBody.innerHTML = '';
        transactionList.forEach(transaction => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.user}</td>
                <td>${transaction.date}</td>
                <td>₹${transaction.amount.toFixed(2)}</td>
                <td>${transaction.type}</td>
                <td><span class="badge ${transaction.status === 'completed' ? 'badge-success' : transaction.status === 'pending' ? 'badge-warning' : 'badge-danger'}">${transaction.status}</span></td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="generateReceipt('${transaction.id}')">Receipt</button>
                    <button class="btn btn-sm btn-danger" onclick="openRefundModal('${transaction.id}')">Refund</button>
                </td>
            `;
            transactionsTableBody.appendChild(tr);
        });
    }

    renderTransactions(transactions);

    function filterTransactions() {
        let filteredTransactions = [...transactions];
        
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredTransactions = filteredTransactions.filter(t => t.user.toLowerCase().includes(searchTerm));
        }

        const date = dateFilter.value;
        if (date) {
            filteredTransactions = filteredTransactions.filter(t => t.date === date);
        }

        const amountRange = amountFilter.value;
        if (amountRange) {
            const [min, max] = amountRange.split('-').map(val => val === '' ? Infinity : parseFloat(val));
            filteredTransactions = filteredTransactions.filter(t => t.amount >= (min || 0) && t.amount <= max);
        }

        renderTransactions(filteredTransactions);
    }

    searchInput.addEventListener('input', filterTransactions);
    dateFilter.addEventListener('change', filterTransactions);
    amountFilter.addEventListener('change', filterTransactions);

    window.openRefundModal = function(transactionId) {
        const transaction = transactions.find(t => t.id === transactionId);
        document.getElementById('refundTransactionId').value = transactionId;
        document.getElementById('refundUserName').textContent = transaction.user;
        document.getElementById('refundAmount').value = transaction.amount;
        document.getElementById('refundReason').value = '';
        openModal('refundModal');
    };

    refundForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const transactionId = document.getElementById('refundTransactionId').value;
        const refundAmount = parseFloat(document.getElementById('refundAmount').value);
        const reason = document.getElementById('refundReason').value;

        const transaction = transactions.find(t => t.id === transactionId);
        if (refundAmount > transaction.amount) {
            alert('Refund amount cannot exceed original transaction amount.');
            return;
        }

        const refundTransaction = {
            id: `RTX${Math.floor(Math.random() * 1000)}`,
            user: transaction.user,
            date: new Date().toISOString().split('T')[0],
            amount: refundAmount,
            type: "refund",
            status: "completed",
            reason: reason
        };

        transactions.push(refundTransaction);
        transaction.status = "refunded";
        closeModal('refundModal');
        renderTransactions(transactions);
        alert(`Refund of ₹${refundAmount.toFixed(2)} processed for ${transaction.user}.`);
    });

    window.generateReceipt = function(transactionId) {
        const transaction = transactions.find(t => t.id === transactionId);
        const receipt = `
            Receipt
            Transaction ID: ${transaction.id}
            User: ${transaction.user}
            Date: ${transaction.date}
            Amount: ₹${transaction.amount.toFixed(2)}
            Type: ${transaction.type}
            Status: ${transaction.status}
            Generated on: ${new Date().toLocaleString()}
        `;
        alert(receipt); 
    };

    window.openModal = function(modalId) {
        document.getElementById(modalId).style.display = 'block';
    };

    window.closeModal = function(modalId) {
        document.getElementById(modalId).style.display = 'none';
    };
});