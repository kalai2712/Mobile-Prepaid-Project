function selectPaymentMethod(element, method) {
    document.querySelectorAll('.payment-method').forEach(method => method.classList.remove('active'));
    element.classList.add('active');
    
    document.querySelectorAll('.payment-form').forEach(form => form.classList.remove('active'));
    const selectedForm = document.getElementById(`${method}Form`);
    if (selectedForm) selectedForm.classList.add('active');
}

function addValidationListeners() {
    const inputs = [
        { id: 'upiId', validator: validateUpiId },
        { id: 'cardNumber', validator: validateCardNumber, formatter: formatCardNumber },
        { id: 'cardName', validator: validateCardName },
        { id: 'expiryDate', validator: validateExpiryDate, formatter: formatExpiryDate },
        { id: 'cvv', validator: validateCVV },
        { id: 'bankSelect', validator: validateBankSelect, event: 'change' },
        { id: 'walletSelect', validator: validateWalletSelect, event: 'change' },
        { id: 'walletMobile', validator: validateWalletMobile }
    ];

    inputs.forEach(input => {
        const element = document.getElementById(input.id);
        if (element) {
            element.addEventListener(input.event || 'input', function() {
                input.validator(this);
                if (input.formatter) input.formatter(this);
            });
        }
    });
}

function validateUpiId(input) {
    const regex = /^[a-zA-Z0-9_.-]+@[a-zA-Z][a-zA-Z]+$/;
    return validateInput(input, 'upiId-error', regex.test(input.value.trim()));
}

function validateCardNumber(input) {
    const regex = /^[0-9]{16}$/;
    return validateInput(input, 'cardNumber-error', regex.test(input.value.replace(/\s+/g, '').trim()));
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').trim().substring(0, 16);
    input.value = value.match(/.{1,4}/g)?.join(' ') || value;
}

function validateCardName(input) {
    return validateInput(input, 'cardName-error', input.value.trim().length >= 3);
}

function validateExpiryDate(input) {
    const value = input.value.trim();
    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(value)) return validateInput(input, 'expiryDate-error', false);
    
    const [month, year] = value.split('/').map(Number);
    const expiryYear = 2000 + year;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    return validateInput(input, 'expiryDate-error', 
        expiryYear > currentYear || (expiryYear === currentYear && month >= currentMonth));
}

function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '').trim().substring(0, 4);
    input.value = value.length > 2 ? `${value.substring(0, 2)}/${value.substring(2)}` : value;
}

function validateCVV(input) {
    const regex = /^[0-9]{3,4}$/;
    return validateInput(input, 'cvv-error', regex.test(input.value.trim()));
}

function validateBankSelect(select) {
    return validateInput(select, 'bankSelect-error', !!select.value);
}

function validateWalletSelect(select) {
    return validateInput(select, 'walletSelect-error', !!select.value);
}

function validateWalletMobile(input) {
    const regex = /^[0-9]{10}$/;
    return validateInput(input, 'walletMobile-error', regex.test(input.value.trim()));
}

function validateInput(element, errorId, isValid) {
    const errorElement = document.getElementById(errorId);
    if (!isValid) {
        element.classList.add('is-invalid');
        errorElement.classList.add('show');
    } else {
        element.classList.remove('is-invalid');
        errorElement.classList.remove('show');
    }
    return isValid;
}

function validateActiveForm() {
    const activeMethod = document.querySelector('.payment-method.active');
    if (!activeMethod) return false;
    
    const method = activeMethod.getAttribute('data-method');
    const validations = {
        'upi': () => validateUpiId(document.getElementById('upiId')),
        'card': () => ['cardNumber', 'cardName', 'expiryDate', 'cvv']
            .every(id => validateInput(document.getElementById(id), `${id}-error`, true)),
        'netbanking': () => validateBankSelect(document.getElementById('bankSelect')),
        'wallet': () => validateWalletSelect(document.getElementById('walletSelect')) && 
                       validateWalletMobile(document.getElementById('walletMobile'))
    };
    
    return validations[method] ? validations[method]() : false;
}

function generateTransactionId() {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
}

function getCurrentDateTime() {
    return new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
}

function createReceiptPopup(planDetails, mobileNumber, paymentMethod) {
    const transactionId = generateTransactionId();
    const dateTime = getCurrentDateTime();
    
    let paymentDetails = '';
    const activeMethod = document.querySelector('.payment-method.active');
    if (activeMethod) {
        const method = activeMethod.getAttribute('data-method');
        const details = {
            'upi': () => `UPI: ${document.getElementById('upiId').value}`,
            'card': () => `Card: XXXX XXXX XXXX ${document.getElementById('cardNumber').value.trim().slice(-4)}`,
            'netbanking': () => `Net Banking: ${document.getElementById('bankSelect').options[document.getElementById('bankSelect').selectedIndex].text}`,
            'wallet': () => `Wallet: ${document.getElementById('walletSelect').options[document.getElementById('walletSelect').selectedIndex].text}`
        };
        paymentDetails = details[method] ? details[method]() : 'Unknown';
    }
    
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'receipt-popup-overlay';
    popupOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const popup = document.createElement('div');
    popup.className = 'receipt-popup';
    popup.style.cssText = `
        background-color: white;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        padding: 25px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;
    `;
    
    popup.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #4CAF50; margin-bottom: 5px;">Payment Successful</h2>
            <div style="font-size: 60px; color: #4CAF50; margin: 20px 0;">✓</div>
            <p style="color: #666; margin-bottom: 20px;">Your recharge has been processed successfully!</p>
        </div>
        
        <div style="border-top: 1px dashed #ddd; border-bottom: 1px dashed #ddd; padding: 15px 0; margin-bottom: 15px;">
            <h3 style="text-align: center; margin-bottom: 15px;">Receipt</h3>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold;">Mobile Number:</span>
                <span>${mobileNumber}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold;">Plan:</span>
                <span>₹${planDetails.price} - ${planDetails.validity}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold;">Data:</span>
                <span>${planDetails.data}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold;">Benefits:</span>
                <span>${planDetails.benefits}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold;">Payment Method:</span>
                <span>${paymentDetails}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold;">Transaction ID:</span>
                <span>${transactionId}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span style="font-weight: bold;">Date & Time:</span>
                <span>${dateTime}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; font-size: 1.1em; margin-top: 15px; border-top: 1px solid #eee; padding-top: 15px;">
                <span>Total Amount:</span>
                <span>₹${planDetails.price}</span>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button id="downloadReceiptBtn" style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; margin-right: 10px; cursor: pointer;">Download Receipt</button>
            <button id="closeReceiptBtn" style="background-color: #f44336; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Close</button>
        </div>
    `;
    
    popupOverlay.appendChild(popup);
    document.body.appendChild(popupOverlay);
    
    document.getElementById('closeReceiptBtn').addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
        window.location.href = 'home.html';
    });
    
    document.getElementById('downloadReceiptBtn').addEventListener('click', () => {
        alert('Receipt download started...');
    });
    
    return popupOverlay;
}

document.addEventListener('DOMContentLoaded', () => {
    const mobileNumber = localStorage.getItem('MOBILE_KEY');
    if (!mobileNumber) {
        window.location.href = 'home.html';
        return;
    }
    
    const mobileDisplay = document.getElementById('mobileDisplay');
    if (mobileDisplay) mobileDisplay.textContent = mobileNumber;
    
    const planDetails = JSON.parse(localStorage.getItem('SELECTED_PLAN'));
    if (!planDetails) {
        window.location.href = 'plans.html';
        return;
    }
    
    const elements = {
        planPrice: document.getElementById('planPrice'),
        planValidity: document.getElementById('planValidity'),
        planData: document.getElementById('planData'),
        planBenefits: document.getElementById('planBenefits'),
        totalAmount: document.getElementById('totalAmount')
    };
    
    if (elements.planPrice) elements.planPrice.textContent = `₹${planDetails.price}`;
    if (elements.planValidity) elements.planValidity.textContent = planDetails.validity;
    if (elements.planData) elements.planData.textContent = planDetails.data;
    if (elements.planBenefits) elements.planBenefits.textContent = planDetails.benefits;
    if (elements.totalAmount) elements.totalAmount.textContent = `₹${planDetails.price}`;
    
    const payButton = document.getElementById('payButton');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    if (payButton) {
        payButton.addEventListener('click', () => {
            if (!validateActiveForm()) return;
            
            loadingOverlay.style.display = 'flex';
            
            const activeMethod = document.querySelector('.payment-method.active');
            const paymentMethod = activeMethod ? activeMethod.getAttribute('data-method') : 'unknown';
            
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                createReceiptPopup(planDetails, mobileNumber, paymentMethod);
            }, 1000);
        });
    }
    
    addValidationListeners();
});