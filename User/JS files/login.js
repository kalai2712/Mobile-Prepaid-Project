const mobileInput = document.getElementById('mobileNumber');
const sendOtpBtn = document.getElementById('sendOtpBtn');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const displayMobile = document.getElementById('displayMobile');
const mobileError = document.getElementById('mobile-error');
const otpError = document.getElementById('otp-error');
const timerCount = document.getElementById('timerCount');
const backToMobile = document.getElementById('backToMobile');
const loadingOverlay = document.getElementById('loadingOverlay');
const otpInputs = document.querySelectorAll('.otp-input');

let timerInterval;
let currentStep = 1;
let serverOtp = '';

document.addEventListener('DOMContentLoaded', () => {
    mobileInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '');
        validateMobile();
    });
    
    sendOtpBtn.addEventListener('click', () => {
        if (validateMobile()) {
            showLoading();
            
            const mobileNumber = mobileInput.value;
            
            sendOtpToMobile(mobileNumber)
                .then(response => {
                    serverOtp = response.otp;
                    
                    alert(`Your OTP is: ${serverOtp}`);
                    
                    displayMobile.textContent = formatMobileNumber(mobileNumber);
                    
                    sessionStorage.setItem('mobileNumber', mobileNumber);
                    
                    goToStep(2);
                    startOtpTimer();
                    hideLoading();
                    
                    otpInputs[0].focus();
                })
                .catch(error => {
                    mobileError.textContent = error.message || 'Failed to send OTP. Please try again.';
                    mobileError.classList.add('show');
                    hideLoading();
                });
        }
    });
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedText = (e.clipboardData || window.clipboardData).getData('text');
            if (/^\d+$/.test(pastedText)) {
                const digits = pastedText.split('');
                otpInputs.forEach((otpInput, i) => {
                    if (i < digits.length) {
                        otpInput.value = digits[i];
                        if (i === otpInputs.length - 1) {
                            validateOtp();
                        }
                    }
                });
                const lastIndex = Math.min(digits.length, otpInputs.length) - 1;
                otpInputs[lastIndex].focus();
            }
        });
        
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            
            if (e.target.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            
            validateOtp();
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
        
        input.addEventListener('focus', (e) => {
            e.target.select();
        });
    });
    
    verifyOtpBtn.addEventListener('click', () => {
        if (validateOtp()) {
            showLoading();
            
            const enteredOtp = [...otpInputs].map(input => input.value).join('');
            
            const mobileNumber = sessionStorage.getItem('mobileNumber');
            
            verifyOtp(mobileNumber, enteredOtp)
                .then(response => {
                    alert('OTP verified successfully!');
                    window.location.href = 'profile.html';
                })
                .catch(error => {
                    otpError.textContent = error.message || 'Invalid OTP. Please try again.';
                    otpError.classList.add('show');
                    hideLoading();
                });
        }
    });
    
    backToMobile.addEventListener('click', (e) => {
        e.preventDefault();
        goToStep(1);
        stopOtpTimer();
    });
});

async function sendOtpToMobile(mobileNumber) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const otp = Math.floor(1000 + Math.random() * 9000).toString();
                
                resolve({
                    success: true,
                    message: 'OTP sent successfully',
                    otp: otp
                });
            } catch (error) {
                reject({
                    success: false,
                    message: 'Failed to send OTP'
                });
            }
        }, 1000);
    });
}

async function verifyOtp(mobileNumber, enteredOtp) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (enteredOtp === serverOtp) {
                resolve({
                    success: true,
                    message: 'OTP verified successfully'
                });
            } else {
                reject({
                    success: false,
                    message: 'Invalid OTP. Please try again.'
                });
            }
        }, 1000);
    });
}

function validateMobile() {
    const mobile = mobileInput.value.trim();
    const isValid = /^[6-9]\d{9}$/.test(mobile);
    
    if (!isValid) {
        mobileInput.classList.add('error');
        mobileError.classList.add('show');
        sendOtpBtn.disabled = true;
        return false;
    } else {
        mobileInput.classList.remove('error');
        mobileError.classList.remove('show');
        sendOtpBtn.disabled = false;
        return true;
    }
}

function validateOtp() {
    const isComplete = [...otpInputs].every(input => input.value.trim() !== '');
    
    if (!isComplete) {
        otpError.classList.remove('show');
        verifyOtpBtn.disabled = true;
        return false;
    } else {
        otpError.classList.remove('show');
        verifyOtpBtn.disabled = false;
        return true;
    }
}

function startOtpTimer() {
    let timeLeft = 30;
    timerCount.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerCount.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            stopOtpTimer();
            document.querySelector('.timer').innerHTML = 
                '<a href="#" class="resend-link" id="resendOtp">Resend OTP</a>';
            
            document.getElementById('resendOtp').addEventListener('click', (e) => {
                e.preventDefault();
                resendOtp();
            });
        }
    }, 1000);
}

function stopOtpTimer() {
    clearInterval(timerInterval);
}

function resendOtp() {
    showLoading();
    
    otpInputs.forEach(input => {
        input.value = '';
    });
    
    const mobileNumber = sessionStorage.getItem('mobileNumber');
    
    sendOtpToMobile(mobileNumber)
        .then(response => {
            serverOtp = response.otp;
            
            alert(`Your new OTP is: ${serverOtp}`);
            
            document.querySelector('.timer').innerHTML = 
                'Resend OTP in <span id="timerCount">30</span> seconds';
            timerCount = document.getElementById('timerCount');
            startOtpTimer();
            
            hideLoading();
            
            otpInputs[0].focus();
        })
        .catch(error => {
            otpError.textContent = error.message || 'Failed to resend OTP. Please try again.';
            otpError.classList.add('show');
            hideLoading();
        });
}

function goToStep(step) {
    document.querySelectorAll('.step').forEach(el => {
        el.classList.remove('active');
    });
    
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
}

function showLoading() {
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    loadingOverlay.style.display = 'none';
}

function formatMobileNumber(mobile) {
    return `+91 ${mobile.substring(0, 10)}`;
}