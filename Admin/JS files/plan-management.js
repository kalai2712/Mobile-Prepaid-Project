document.addEventListener('DOMContentLoaded', function() {
    // Sample plan data with Indian Rupees
    let plans = [
        { id: 1, name: "Basic Plan", price: 199.00, validity: 28, benefits: "5GB Data, 100 Minutes", status: "active" },
        { id: 2, name: "Premium Plan", price: 399.00, validity: 28, benefits: "15GB Data, Unlimited Calls", status: "active" },
        { id: 3, name: "Unlimited Plan", price: 999.00, validity: 56, benefits: "Unlimited Data, Unlimited Calls", status: "inactive" }
    ];

    const plansTableBody = document.getElementById('plansTableBody');
    const statusFilter = document.getElementById('statusFilter');
    const addPlanBtn = document.getElementById('addPlanBtn');
    const planFormModal = document.getElementById('planFormModal');
    const planForm = document.getElementById('planForm');
    const modalTitle = document.getElementById('modalTitle');
    let editingPlanId = null;

    // Render plans table
    function renderPlans(planList) {
        plansTableBody.innerHTML = '';
        planList.forEach(plan => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${plan.id}</td>
                <td>${plan.name}</td>
                <td>₹${plan.price.toFixed(2)}</td>
                <td>${plan.validity} days</td>
                <td>${plan.benefits}</td>
                <td class="status-${plan.status}">${plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}</td>
                <td class="action-buttons">
                    <button class="action-btn edit-btn" data-id="${plan.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${plan.id}">Delete</button>
                </td>
            `;
            plansTableBody.appendChild(row);
        });
    }

    // Initial render
    renderPlans(plans);

    // Filter functionality
    statusFilter.addEventListener('change', function() {
        const status = this.value;
        const filteredPlans = status === 'all' ? plans : plans.filter(plan => plan.status === status);
        renderPlans(filteredPlans);
    });

    // Add Plan Modal
    addPlanBtn.addEventListener('click', () => {
        editingPlanId = null;
        modalTitle.textContent = 'Add New Plan';
        planForm.reset();
        planFormModal.style.display = 'block';
    });

    // Close Modal
    document.querySelector('.close-modal').addEventListener('click', () => {
        planFormModal.style.display = 'none';
    });

    // Handle Form Submission
    planForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPlan = {
            id: editingPlanId || Date.now(),
            name: document.getElementById('planName').value,
            price: parseFloat(document.getElementById('planPrice').value),
            validity: parseInt(document.getElementById('planValidity').value),
            benefits: document.getElementById('planBenefits').value,
            status: document.getElementById('planStatus').value
        };

        if (editingPlanId) {
            plans = plans.map(plan => plan.id === editingPlanId ? newPlan : plan);
        } else {
            plans.push(newPlan);
        }

        renderPlans(plans);
        planFormModal.style.display = 'none';
    });

    // Handle table actions
    plansTableBody.addEventListener('click', (e) => {
        const id = parseInt(e.target.dataset.id);
        const plan = plans.find(p => p.id === id);

        if (e.target.classList.contains('edit-btn')) {
            editingPlanId = id;
            modalTitle.textContent = 'Edit Plan';
            document.getElementById('planName').value = plan.name;
            document.getElementById('planPrice').value = plan.price;
            document.getElementById('planValidity').value = plan.validity;
            document.getElementById('planBenefits').value = plan.benefits;
            document.getElementById('planStatus').value = plan.status;
            planFormModal.style.display = 'block';
        }

        if (e.target.classList.contains('delete-btn')) {
            if (confirm(`Are you sure you want to delete ${plan.name}?`)) {
                plans = plans.filter(p => p.id !== id);
                renderPlans(plans);
            }
        }
    });
});