// Sample user data with Indian Rupees
let users = [
    { id: 1, name: "Kalaiyarasan", email: "kalai@example.com", plan: "premium", balance: 1250.50, status: "active", created: "2023-01-15", lastLogin: "2023-06-10 14:25:30" },
    { id: 2, name: "Dilip", email: "dilip@example.com", plan: "basic", balance: 340.20, status: "active", created: "2023-02-20", lastLogin: "2023-06-12 09:15:45" },
    { id: 3, name: "Barani", email: "barani@example.com", plan: "free", balance: 0, status: "inactive", created: "2023-03-05", lastLogin: "2023-05-18 16:30:00" },
    { id: 4, name: "Karthi", email: "karthi@example.com", plan: "enterprise", balance: 5000.00, status: "active", created: "2023-01-10", lastLogin: "2023-06-11 11:45:20" },
    { id: 5, name: "Siva", email: "siva@example.com", plan: "premium", balance: 980.75, status: "active", created: "2023-04-12", lastLogin: "2023-06-09 08:10:15" },
    { id: 6, name: "Prem", email: "prem@example.com", plan: "basic", balance: 150.30, status: "inactive", created: "2023-03-18", lastLogin: "2023-05-25 13:40:50" },
    { id: 7, name: "Fazil", email: "Fazil@example.com", plan: "premium", balance: 2100.45, status: "active", created: "2023-02-28", lastLogin: "2023-06-08 17:55:30" },
    { id: 8, name: "Safi", email: "safi@example.com", plan: "free", balance: 0, status: "active", created: "2023-05-05", lastLogin: "2023-06-07 10:20:45" },
    { id: 9, name: "Madhav", email: "madhav@example.com", plan: "enterprise", balance: 7500.60, status: "active", created: "2023-01-22", lastLogin: "2023-06-12 14:30:15" },
    { id: 10, name: "Prasanna", email: "prasanna@example.com", plan: "basic", balance: 420.90, status: "inactive", created: "2023-04-03", lastLogin: "2023-05-30 09:05:40" }
];

// Sample transaction data with Indian Rupees
const generateTransactions = (userId) => {
    const types = ["payment", "refund", "subscription", "withdrawal"];
    const statuses = ["completed", "pending", "failed"];
    const transactions = [];
    
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 transactions
    
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const amount = type === "refund" || type === "withdrawal" ? 
                       -(Math.random() * 5000).toFixed(2) : 
                       (Math.random() * 5000).toFixed(2);
                       
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        transactions.push({
            id: Math.floor(Math.random() * 100000),
            date: date.toISOString().split('T')[0],
            type,
            amount,
            status
        });
    }
    
    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Sample activity data with Indian Rupees
const generateActivities = (userId) => {
    const actions = ["login", "password_change", "profile_update", "subscription_change", "payment"];
    const activities = [];
    
    const count = Math.floor(Math.random() * 5) + 3; // 3-7 activities
    
    for (let i = 0; i < count; i++) {
        const action = actions[Math.floor(Math.random() * actions.length)];
        
        let details;
        switch(action) {
            case "login":
                details = "User logged in from IP 192.168.1." + Math.floor(Math.random() * 255);
                break;
            case "password_change":
                details = "Password changed successfully";
                break;
            case "profile_update":
                details = "Profile information updated";
                break;
            case "subscription_change":
                const plans = ["free", "basic", "premium", "enterprise"];
                details = `Subscription changed to ${plans[Math.floor(Math.random() * plans.length)]}`;
                break;
            case "payment":
                details = `Payment of ₹${(Math.random() * 5000).toFixed(2)} processed`;
                break;
        }
        
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        activities.push({
            date: date.toISOString().split('T')[0] + " " + 
                  ("0" + date.getHours()).slice(-2) + ":" + 
                  ("0" + date.getMinutes()).slice(-2) + ":" + 
                  ("0" + date.getSeconds()).slice(-2),
            action,
            details
        });
    }
    
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Pagination variables
let currentPage = 1;
const rowsPerPage = 5;

// Sorting variables
let currentSort = { field: 'id', direction: 'asc' };

// Filter variables
let filters = {
    search: '',
    status: '',
    plan: ''
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    renderTable();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addUserForm').addEventListener('submit', handleAddUser);
    document.getElementById('editUserForm').addEventListener('submit', handleEditUser);
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('statusFilter').addEventListener('change', handleFilter);
    document.getElementById('planFilter').addEventListener('change', handleFilter);
    document.querySelectorAll('th.sortable').forEach(th => {
        th.addEventListener('click', () => handleSort(th.dataset.sort));
    });
    document.querySelectorAll('.tab-link').forEach(tab => {
        tab.addEventListener('click', () => handleTabClick(tab.dataset.tab));
    });
}

// Handle search input
function handleSearch(event) {
    filters.search = event.target.value.toLowerCase();
    renderTable();
}

// Handle filter change
function handleFilter(event) {
    filters[event.target.id.replace('Filter', '')] = event.target.value;
    renderTable();
}

// Handle sort click
function handleSort(field) {
    if (currentSort.field === field) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.direction = 'asc';
    }
    renderTable();
}

// Handle tab click
function handleTabClick(tab) {
    document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.getElementById(tab).classList.add('active');
}

// Render table
function renderTable() {
    const filteredUsers = users.filter(user => {
        return (
            (!filters.search || user.name.toLowerCase().includes(filters.search) || user.email.toLowerCase().includes(filters.search)) &&
            (!filters.status || user.status === filters.status) &&
            (!filters.plan || user.plan === filters.plan)
        );
    });

    const sortedUsers = filteredUsers.sort((a, b) => {
        if (a[currentSort.field] < b[currentSort.field]) return currentSort.direction === 'asc' ? -1 : 1;
        if (a[currentSort.field] > b[currentSort.field]) return currentSort.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedUsers = sortedUsers.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    paginatedUsers.forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.plan}</td>
            <td>₹${user.balance.toFixed(2)}</td>
            <td><span class="badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}">${user.status}</span></td>
            <td>
                <button class="btn btn-sm btn-info" onclick="openUserDetails(${user.id})">Details</button>
                <button class="btn btn-sm btn-warning" onclick="openEditUserModal(${user.id})">Edit</button>
                <button class="btn btn-sm btn-danger" onclick="confirmDelete(${user.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    renderPagination(sortedUsers.length);
}

// Render pagination
function renderPagination(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.classList.toggle('active', i === currentPage);
        button.disabled = i === currentPage;
        button.addEventListener('click', () => {
            currentPage = i;
            renderTable();
        });
        pagination.appendChild(button);
    }
}

// Open modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Close modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Handle add user
function handleAddUser(event) {
    event.preventDefault();
    const form = event.target;
    const newUser = {
        id: users.length + 1,
        name: form.name.value,
        email: form.email.value,
        plan: form.plan.value,
        balance: parseFloat(form.balance.value),
        status: 'active',
        created: new Date().toISOString().split('T')[0],
        lastLogin: '-'
    };
    users.push(newUser);
    form.reset();
    closeModal('addUserModal');
    renderTable();
}

// Handle edit user
function handleEditUser(event) {
    event.preventDefault();
    const form = event.target;
    const userId = parseInt(form.editUserId.value);
    const user = users.find(user => user.id === userId);
    user.name = form.editName.value;
    user.email = form.editEmail.value;
    user.plan = form.editPlan.value;
    user.balance = parseFloat(form.editBalance.value);
    user.status = form.editStatus.value;
    closeModal('editUserModal');
    renderTable();
}

// Handle delete user confirmation
function confirmDelete(userId) {
    const user = users.find(user => user.id === userId);
    document.getElementById('confirmationTitle').textContent = 'Confirm Deletion';
    document.getElementById('confirmationMessage').textContent = `Are you sure you want to delete ${user.name}?`;
    openModal('confirmationModal');

    const confirmButton = document.getElementById('confirmButton');
    confirmButton.onclick = function() {
        handleDeleteUser(userId);
    };
}

// Handle delete user
function handleDeleteUser(userId) {
    users = users.filter(user => user.id !== userId);
    closeModal('confirmationModal');
    renderTable();
}

// Open user details modal
function openUserDetails(userId) {
    const user = users.find(user => user.id === userId);
    document.getElementById('detailUserId').textContent = user.id;
    document.getElementById('detailUserName').textContent = user.name;
    document.getElementById('detailUserEmail').textContent = user.email;
    document.getElementById('detailUserPlan').textContent = user.plan;
    document.getElementById('detailUserBalance').textContent = `₹${user.balance.toFixed(2)}`;
    document.getElementById('detailUserStatus').textContent = user.status;
    document.getElementById('detailUserCreated').textContent = user.created;
    document.getElementById('detailUserLastLogin').textContent = user.lastLogin;

    const transactions = generateTransactions(userId);
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    transactionsTableBody.innerHTML = '';
    transactions.forEach(transaction => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${transaction.id}</td>
            <td>${transaction.date}</td>
            <td>${transaction.type}</td>
            <td>₹${transaction.amount}</td>
            <td>${transaction.status}</td>
        `;
        transactionsTableBody.appendChild(tr);
    });

    const activities = generateActivities(userId);
    const activityTableBody = document.getElementById('activityTableBody');
    activityTableBody.innerHTML = '';
    activities.forEach(activity => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${activity.date}</td>
            <td>${activity.action}</td>
            <td>${activity.details}</td>
        `;
        activityTableBody.appendChild(tr);
    });

    openModal('userDetailsModal');
}

// Open edit user modal
function openEditUserModal(userId) {
    const user = users.find(user => user.id === userId);
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editName').value = user.name;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editPlan').value = user.plan;
    document.getElementById('editBalance').value = user.balance;
    document.getElementById('editStatus').value = user.status;
    openModal('editUserModal');
}