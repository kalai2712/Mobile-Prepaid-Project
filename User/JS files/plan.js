function saveMobileNumber(mobileNumber) {
    localStorage.setItem('MOBILE_KEY', mobileNumber);
}

function getMobileNumber() {
    return localStorage.getItem('MOBILE_KEY');
}

function validateMobileNumber(mobileNumber) {
    return /^\d{10}$/.test(mobileNumber);
}

function saveSelectedPlan(planDetails) {
    localStorage.setItem('SELECTED_PLAN', JSON.stringify(planDetails));
}

function getSelectedPlan() {
    const planJSON = localStorage.getItem('SELECTED_PLAN');
    return planJSON ? JSON.parse(planJSON) : null;
}

function showMobileChangeModal() {
    let modalContainer = document.getElementById('mobileChangeModal');
    
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'mobileChangeModal';
        modalContainer.className = 'modal-container';
        
        modalContainer.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Change Mobile Number</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Please enter the new mobile number</p>
                    <input type="tel" id="newMobileInput" class="mobile-input" placeholder="Enter 10-digit mobile number" maxlength="10">
                    <div id="mobileError" class="error-text"></div>
                </div>
                <div class="modal-footer">
                    <button class="cancel-btn">Cancel</button>
                    <button class="save-btn">Save</button>
                </div>
            </div>
        `;
        
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            .modal-container {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 1000;
                justify-content: center;
                align-items: center;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 400px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                animation: modalFadeIn 0.3s;
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; transform: translateY(-20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #1f2937;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .mobile-input {
                width: 100%;
                padding: 10px;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                font-size: 16px;
                margin-top: 10px;
            }
            
            .error-text {
                color: #ef4444;
                font-size: 14px;
                margin-top: 5px;
                min-height: 20px;
            }
            
            .modal-footer {
                padding: 15px 20px;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                border-top: 1px solid #e5e7eb;
            }
            
            .cancel-btn {
                padding: 8px 15px;
                background-color: #f3f4f6;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                cursor: pointer;
            }
            
            .save-btn {
                padding: 8px 15px;
                background-color: #2563eb;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            }
            
            .save-btn:hover {
                background-color: #1d4ed8;
            }
        `;
        
        document.head.appendChild(modalStyle);
        document.body.appendChild(modalContainer);
        
        const closeBtn = modalContainer.querySelector('.close-btn');
        const cancelBtn = modalContainer.querySelector('.cancel-btn');
        const saveBtn = modalContainer.querySelector('.save-btn');
        const mobileInput = modalContainer.querySelector('#newMobileInput');
        const errorText = modalContainer.querySelector('#mobileError');
        
        closeBtn.addEventListener('click', () => {
            modalContainer.style.display = 'none';
        });
        
        cancelBtn.addEventListener('click', () => {
            modalContainer.style.display = 'none';
        });
        
        mobileInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            errorText.textContent = '';
        });
        
        saveBtn.addEventListener('click', () => {
            const newMobile = mobileInput.value;
            
            if (validateMobileNumber(newMobile)) {
                saveMobileNumber(newMobile);
                
                const mobileDisplayElement = document.querySelector('.mobile-number div div:nth-child(2)');
                if (mobileDisplayElement) {
                    mobileDisplayElement.textContent = newMobile;
                }
                
                modalContainer.style.display = 'none';
            } else {
                errorText.textContent = 'Please enter a valid 10-digit mobile number';
            }
        });
    }
    
    modalContainer.style.display = 'flex';
    const currentMobile = getMobileNumber() || '';
    const mobileInput = modalContainer.querySelector('#newMobileInput');
    mobileInput.value = currentMobile;
    mobileInput.focus();
    modalContainer.querySelector('#mobileError').textContent = '';
}

function initPlansPage() {
    const mobileNumber = getMobileNumber();
    
    if (!mobileNumber) {
        window.location.href = 'home.html';
        return;
    }
    
    const mobileDisplayElement = document.querySelector('.mobile-number div div:nth-child(2)');
    if (mobileDisplayElement) {
        mobileDisplayElement.textContent = mobileNumber;
    }
    
    const changeBtn = document.querySelector('.change-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', showMobileChangeModal);
    }
}

function redirectToPayment(price, validity, data, benefits) {
    const planDetails = {
        price: price,
        validity: validity,
        data: data,
        benefits: benefits
    };
    
    saveSelectedPlan(planDetails);
    
    window.location.href = 'payment.html';
}

const plansData = {
    'Popular Plans': [
        { price: 299, validity: '28 days', data: '2GB/day', benefits: 'Unlimited calls, 100 SMS/day' },
        { price: 399, validity: '56 days', data: '3GB/day', benefits: 'Unlimited calls, Disney+ subscription' },
        { price: 499, validity: '84 days', data: '2.5GB/day', benefits: 'Unlimited calls, Amazon Prime subscription' },
        { price: 666, validity: '84 days', data: '1.5GB/day', benefits: 'Unlimited calls, 100 SMS/day' },
        { price: 719, validity: '84 days', data: '2GB/day', benefits: 'Unlimited calls, Netflix subscription' },
        { price: 799, validity: '84 days', data: '3GB/day', benefits: 'Unlimited calls, all OTT subscriptions' }
    ],
    'Data Plans': [
        { price: 58, validity: '28 days', data: '3GB', benefits: 'Data only pack' },
        { price: 118, validity: '28 days', data: '12GB', benefits: 'Data only pack' },
        { price: 301, validity: '30 days', data: '50GB', benefits: 'Data only pack, rollover allowed' },
        { price: 418, validity: '56 days', data: '100GB', benefits: 'Data only pack, unlimited 5G' },
        { price: 838, validity: '84 days', data: '200GB', benefits: 'Data only pack, unlimited 5G' },
        { price: 1201, validity: '365 days', data: '100GB', benefits: 'Annual data pack' }
    ],
    'Family Plans': [
        { price: 799, validity: '28 days', data: '3GB/day/connection', benefits: '2 connections, Unlimited calls' },
        { price: 999, validity: '28 days', data: '3GB/day/connection', benefits: '3 connections, Unlimited calls' },
        { price: 1499, validity: '28 days', data: '4GB/day/connection', benefits: '4 connections, Premium' },
        { price: 1999, validity: '56 days', data: '3GB/day/connection', benefits: '3 connections, All OTT' },
        { price: 2999, validity: '84 days', data: '3GB/day/connection', benefits: '4 connections, Premium' },
        { price: 5999, validity: '365 days', data: '3GB/day/connection', benefits: '4 connections, All inclusive' }
    ],
    'International Plans': [
        { price: 499, validity: '1 day', data: '500MB', benefits: 'International roaming - Basic' },
        { price: 999, validity: '7 days', data: '2GB', benefits: 'International roaming - Standard' },
        { price: 1499, validity: '10 days', data: '5GB', benefits: 'International roaming - Plus' },
        { price: 2999, validity: '30 days', data: '10GB', benefits: 'International roaming - Premium' },
        { price: 3999, validity: '30 days', data: '20GB', benefits: 'Multi-country roaming - Basic' },
        { price: 4999, validity: '30 days', data: '30GB', benefits: 'Multi-country roaming - Plus' },
        { price: 5999, validity: '60 days', data: '50GB', benefits: 'Multi-country roaming - Premium' }
    ]
};

function renderPlanItem(plan) {
    return `
        <div class="plan-item">
            <div class="plan-price">₹${plan.price}</div>
            <div class="plan-validity">${plan.validity}</div>
            <div class="plan-benefits">
                <div><strong>Data:</strong> ${plan.data}</div>
                <div>${plan.benefits}</div>
            </div>
            <button class="recharge-btn" onclick="redirectToPayment('${plan.price}', '${plan.validity}', '${plan.data}', '${plan.benefits}')">Recharge</button>
        </div>
    `;
}

function renderCategoryTabs(categories) {
    const categoryTabs = document.getElementById('categoryTabs');
    categoryTabs.innerHTML = categories.map((category, index) => 
        `<div class="category-tab ${index === 0 ? 'active' : ''}" data-category="${category}">${category}</div>`
    ).join('');
}

function renderPlans(categoryName, plans) {
    const plansGrid = document.getElementById('plansGrid');
    plansGrid.innerHTML = plans.map(renderPlanItem).join('');
}

function searchPlans(searchTerm) {
    const filteredPlans = {};
    Object.entries(plansData).forEach(([category, plans]) => {
        const matchedPlans = plans.filter(plan => 
            category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.benefits.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.data.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plan.price.toString().includes(searchTerm)
        );
        if (matchedPlans.length > 0) {
            filteredPlans[category] = matchedPlans;
        }
    });
    return filteredPlans;
}

function filterPlans(plans, filters) {
    let filtered = [...plans];
    if (filters.price) {
        filtered.sort((a, b) => a.price - b.price);
    }
    if (filters.validity) {
        filtered.sort((a, b) => {
            const getDays = validity => {
                const days = parseInt(validity);
                return isNaN(days) ? 0 : days;
            };
            return getDays(b.validity) - getDays(a.validity);
        });
    }
    if (filters.data) {
        filtered.sort((a, b) => {
            const getData = dataStr => {
                const match = dataStr.match(/(\d+)GB/);
                return match ? parseInt(match[1]) : 0;
            };
            return getData(b.data) - getData(a.data);
        });
    }
    return filtered;
}

document.addEventListener('DOMContentLoaded', () => {
    const categories = Object.keys(plansData);
    renderCategoryTabs(categories);
    
    renderPlans(categories[0], plansData[categories[0]]);

    document.getElementById('categoryTabs').addEventListener('click', (e) => {
        if (e.target.classList.contains('category-tab')) {
            document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
            e.target.classList.add('active');
            
            const category = e.target.getAttribute('data-category');
            let filteredPlans = plansData[category];
            
            const filterCheckboxes = document.querySelectorAll('.filter-option input');
            const filters = {
                price: document.getElementById('priceFilter').checked,
                validity: document.getElementById('validityFilter').checked,
                data: document.getElementById('dataFilter').checked
            };
            
            filteredPlans = filterPlans(filteredPlans, filters);
            
            const searchTerm = document.getElementById('searchInput').value;
            if (searchTerm) {
                const searchResults = searchPlans(searchTerm);
                if (searchResults[category]) {
                    filteredPlans = searchResults[category];
                } else {
                    filteredPlans = [];
                }
            }
            
            renderPlans(category, filteredPlans);
        }
    });

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        
        if (searchTerm) {
            const filteredPlans = searchPlans(searchTerm);
            
            if (Object.keys(filteredPlans).length > 0) {
                const firstCategory = Object.keys(filteredPlans)[0];
                
                document.querySelectorAll('.category-tab').forEach(tab => {
                    if (tab.getAttribute('data-category') === firstCategory) {
                        tab.classList.add('active');
                    } else {
                        tab.classList.remove('active');
                    }
                });
                
                renderPlans(firstCategory, filteredPlans[firstCategory]);
            } else {
                document.getElementById('plansGrid').innerHTML = '<div class="text-center p-4">No plans found matching your search.</div>';
            }
        } else {
            const activeTab = document.querySelector('.category-tab.active');
            const category = activeTab.getAttribute('data-category');
            renderPlans(category, plansData[category]);
        }
    });

    const filterIcon = document.getElementById('filterIcon');
    const filterMenu = document.getElementById('filterMenu');
    filterIcon.addEventListener('click', () => {
        filterMenu.classList.toggle('active');
    });

    const filterCheckboxes = document.querySelectorAll('.filter-option input');
    const filters = {
        price: false,
        validity: false,
        data: false
    };

    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            filters[checkbox.value] = checkbox.checked;
            
            const activeTab = document.querySelector('.category-tab.active');
            const category = activeTab.getAttribute('data-category');
            
            let filteredCategoryPlans = plansData[category];
            filteredCategoryPlans = filterPlans(filteredCategoryPlans, filters);
            
            const searchTerm = searchInput.value;
            if (searchTerm) {
                const searchResults = searchPlans(searchTerm);
                if (searchResults[category]) {
                    filteredCategoryPlans = filterPlans(searchResults[category], filters);
                } else {
                    filteredCategoryPlans = [];
                }
            }
            
            renderPlans(category, filteredCategoryPlans);
        });
    });

    document.addEventListener('click', (e) => {
        if (!filterIcon.contains(e.target) && !filterMenu.contains(e.target)) {
            filterMenu.classList.remove('active');
        }
    });

    initPlansPage();
});