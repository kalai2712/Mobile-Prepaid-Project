document.addEventListener('DOMContentLoaded', function() {
    const mobileForm = document.getElementById('mobileForm');
    const mobileError = document.getElementById('mobileError');
    const otpPopup = document.getElementById('otpPopup');
    const otpInput = document.getElementById('otpInput');
    const otpError = document.getElementById('otpError');
    const verifyOtpBtn = document.getElementById('verifyOtpBtn');
    const resendOtp = document.getElementById('resendOtp');
    const timerDisplay = document.getElementById('timer');
    const successPopup = document.getElementById('successPopup');
    const errorPopup = document.getElementById('errorPopup');
    const errorMessage = document.getElementById('errorMessage');
    const otpDisplay = document.getElementById('otpDisplay');

    let generatedOtp;
    let otpTimer;
    let attempts = 1;
    let timeLeft = 30;

    mobileForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const mobileNumber = "+91" + document.getElementById('mobileNumber').value;

        const mobileRegex = /^\+91[0-9]{10}$/;
        if (!mobileRegex.test(mobileNumber)) {
            mobileError.textContent = "Please enter a valid 10-digit mobile number.";
            mobileError.style.display = 'block';
            return;
        }

        generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        mobileError.style.display = 'none';

        otpDisplay.textContent = generatedOtp;
        openPopup('otpPopup');
        startOtpTimer(mobileNumber);
    });

    verifyOtpBtn.addEventListener('click', function() {
        const enteredOtp = otpInput.value;
        if (enteredOtp.length !== 6 || isNaN(enteredOtp)) {
            showErrorPopup("Please enter a valid 6-digit OTP.");
            return;
        }

        if (enteredOtp === generatedOtp && timeLeft > 0) {
            clearInterval(otpTimer);
            closePopup('otpPopup');
            openPopup('successPopup');
            setTimeout(() => {
                window.location.href = "admin-dashboard.html";
            }, 2000); 
        } else {
            attempts--;
            if (attempts > 0 && timeLeft > 0) {
                otpError.textContent = `Invalid OTP. ${attempts} attempts remaining.`;
                otpError.style.display = 'block';
            } else {
                clearInterval(otpTimer);
                closePopup('otpPopup');
                if (timeLeft <= 0) {
                    showErrorPopup("OTP expired. Please request a new one.");
                } else {
                    showErrorPopup("Maximum attempts reached. Please request a new OTP.");
                }
            }
        }
    });

    resendOtp.addEventListener('click', function(event) {
        event.preventDefault();
        if (!resendOtp.classList.contains('disabled')) {
            const mobileNumber = "+91" + document.getElementById('mobileNumber').value;
            generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
            otpDisplay.textContent = generatedOtp;
            otpInput.value = '';
            otpError.style.display = 'none';
            attempts = 1;
            startOtpTimer(mobileNumber);
        }
    });

    function startOtpTimer(mobileNumber) {
        timeLeft = 30;
        timerDisplay.textContent = timeLeft;
        resendOtp.classList.add('disabled');
        otpError.style.display = 'none';
        console.log(`OTP sent to ${mobileNumber}: ${generatedOtp}`); 

        clearInterval(otpTimer); 
        otpTimer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                resendOtp.classList.remove('disabled');
            }
        }, 1000);
    }

    document.getElementById('switchToEmail').addEventListener('click', function(event) {
        event.preventDefault();
        showErrorPopup("Email login not implemented yet.");
    });

    function openPopup(popupId) {
        document.getElementById(popupId).style.display = 'flex';
    }

    window.closePopup = function(popupId) {
        document.getElementById(popupId).style.display = 'none';
        if (popupId === 'otpPopup') {
            otpInput.value = '';
            otpError.style.display = 'none';
        }
    };

    function showErrorPopup(message) {
        errorMessage.textContent = message;
        openPopup('errorPopup');
    }
});