document.addEventListener('DOMContentLoaded', function() {
    const issueForm = document.getElementById('issueForm');
    const faqSearch = document.getElementById('faqSearch');
    const faqList = document.getElementById('faqList');
    const ticketList = document.getElementById('ticketList');
    const successPopup = document.getElementById('successPopup');

    // Sample ticket data (simulated)
    let tickets = [
        { id: "T123", issue: "Recharge Issue", status: "Open", date: "2025-02-28" },
        { id: "T124", issue: "Balance Deduction", status: "Resolved", date: "2025-02-27" }
    ];

    // Form submission
    issueForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const issueType = document.getElementById('issueType').value;
        const description = document.getElementById('issueDescription').value;
        const file = document.getElementById('issueFile').files[0];

        const ticket = {
            id: `T${Math.floor(Math.random() * 1000)}`,
            issue: issueType,
            status: "Open",
            date: new Date().toISOString().split('T')[0]
        };

        tickets.push(ticket);
        renderTickets();
        openPopup('successPopup');
        issueForm.reset();
    });

    // FAQ accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
        });
    });

    // FAQ search
    faqSearch.addEventListener('input', function() {
        const searchTerm = faqSearch.value.toLowerCase();
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.faq-question').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
            item.style.display = (question.includes(searchTerm) || answer.includes(searchTerm)) ? 'block' : 'none';
        });
    });

    // Render tickets
    function renderTickets() {
        ticketList.innerHTML = '';
        tickets.forEach(ticket => {
            const div = document.createElement('div');
            div.className = 'ticket';
            div.innerHTML = `
                <strong>Ticket ID:</strong> ${ticket.id}<br>
                <strong>Issue:</strong> ${ticket.issue}<br>
                <strong>Status:</strong> ${ticket.status}<br>
                <strong>Date:</strong> ${ticket.date}
            `;
            ticketList.appendChild(div);
        });
    }

    renderTickets();

    // Quick action functions (placeholders)
    window.checkBalance = function() {
        alert("Balance check not implemented yet."); // Replace with actual logic
    };

    window.viewTransactions = function() {
        alert("Transaction view not implemented yet."); // Replace with actual logic
    };

    window.contactSupport = function() {
        alert("Contacting customer care not implemented yet."); // Replace with actual logic
    };

    window.startLiveChat = function() {
        alert("Live chat not implemented yet."); // Replace with actual logic
    };

    // Popup functions
    function openPopup(popupId) {
        document.getElementById(popupId).style.display = 'flex';
    }

    window.closePopup = function(popupId) {
        document.getElementById(popupId).style.display = 'none';
    };
});