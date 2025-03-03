// Common functions for mobile number handling across pages
function saveMobileNumber(mobileNumber) {
    localStorage.setItem('MOBILE_KEY', mobileNumber);
}

function getMobileNumber() {
    return localStorage.getItem('MOBILE_KEY');
}

function validateMobileNumber(mobileNumber) {
    return /^\d{10}$/.test(mobileNumber);
}

// Function to save selected plan details
function saveSelectedPlan(planDetails) {
    localStorage.setItem('SELECTED_PLAN', JSON.stringify(planDetails));
}

// Function to get selected plan details
function getSelectedPlan() {
    const planJSON = localStorage.getItem('SELECTED_PLAN');
    return planJSON ? JSON.parse(planJSON) : null;
}

// Function to display custom mobile number change modal
function showMobileChangeModal() {
    // Create modal container if it doesn't exist
    let modalContainer = document.getElementById('mobileChangeModal');
    
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'mobileChangeModal';
        modalContainer.className = 'modal-container';
        
        // Modal HTML structure
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
        
        // Add modal styles
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
        
        // Set up event listeners for the modal
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
        
        // Restrict input to numbers only
        mobileInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            errorText.textContent = '';
        });
        
        saveBtn.addEventListener('click', () => {
            const newMobile = mobileInput.value;
            
            if (validateMobileNumber(newMobile)) {
                saveMobileNumber(newMobile);
                
                // Update mobile display on the page
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
    
    // Show modal and pre-fill with current number
    modalContainer.style.display = 'flex';
    const currentMobile = getMobileNumber() || '';
    const mobileInput = modalContainer.querySelector('#newMobileInput');
    mobileInput.value = currentMobile;
    mobileInput.focus();
    modalContainer.querySelector('#mobileError').textContent = '';
}

// Function to handle plans page initialization
function initPlansPage() {
    const mobileNumber = getMobileNumber();
    
    // If no mobile number is stored, redirect back to home
    if (!mobileNumber) {
        window.location.href = 'index.html';
        return;
    }
    
    // Display mobile number in plans page
    const mobileDisplayElement = document.querySelector('.mobile-number div div:nth-child(2)');
    if (mobileDisplayElement) {
        mobileDisplayElement.textContent = mobileNumber;
    }
    
    // Handle change button click
    const changeBtn = document.querySelector('.change-btn');
    if (changeBtn) {
        changeBtn.addEventListener('click', showMobileChangeModal);
    }
}

// Function to redirect to payment page with plan details
function redirectToPayment(price, validity, data, benefits) {
    const planDetails = {
        price: price,
        validity: validity,
        data: data,
        benefits: benefits
    };
    
    // Save plan details to localStorage
    saveSelectedPlan(planDetails);
    
    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Home page specific initialization
document.addEventListener('DOMContentLoaded', () => {
    const mobileInput = document.getElementById('mobileNumber');
    const rechargeBtn = document.querySelector('.btn-recharge-hero');
    const errorMessage = document.getElementById('error-message');

    mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
        errorMessage.textContent = ''; 
    });

    rechargeBtn.addEventListener('click', () => {
        const mobileNumber = mobileInput.value;
        
        if (!validateMobileNumber(mobileNumber)) {
            errorMessage.textContent = 'Please enter a valid 10-digit mobile number';
            return;
        }

        saveMobileNumber(mobileNumber);
        window.location.href = 'plan.html';
    });

    const authState = getAuthState(); // Assuming this function exists elsewhere
    if (authState?.isLoggedIn) {
        mobileInput.value = authState.mobileNumber;
    }
});