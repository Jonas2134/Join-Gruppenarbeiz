/**
 * Checks if a user with the given email exists in the users array.
 * 
 * @param {string} email - The email to check.
 * @returns {boolean} - Returns true if the email exists, false otherwise.
 */
function userEmailExists(email) {
    return users.some(user => user.user_email === email);
}

/**
 * Displays a password confirmation error by showing the error message
 * and adding a red underline to the confirm input field.
 */
function passwordConfirmError() {
    document.getElementById('password-error').classList.remove('d_none');
    document.getElementById('confirm-input').classList.add('red_underline');
}

/**
 * Displays an email existence error by showing the error message
 * and adding a red underline to the email input field.
 */
function emailExistError() {
    document.getElementById('email-error').classList.remove('d_none');
    document.getElementById('email-input').classList.add('red_underline');
}

/**
 * Generates a random ID between 100 and 999.
 * 
 * @returns {number} - A random ID.
 */
function generateRandomId() {
    const min = 100;
    const max = 999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUsers();

    /**
     * Handles the form submission for user registration.
     * Validates the password confirmation and email uniqueness.
     * Displays error messages if validation fails.
     * Submits the user data if validation passes and shows a popup.
     */
    document.getElementById("myForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(document.getElementById("myForm"));
        const email = formData.get("user_email");
        const password = formData.get("user_password");
        const confirm = formData.get("user_password_confirm");

        if (password !== confirm) {
            passwordConfirmError();
            return;
        }

        if (userEmailExists(email)) {
            emailExistError();
            return;
        }
        
        const userData = {};
        formData.forEach((value, id) => userData[id] = value);
        userData.id = generateRandomId();

        await postData("/users", userData);
        document.getElementById('popup_container').classList.add('show');
        document.getElementById('popup').classList.add('show');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    });

    /**
     * Removes the red underline and hides the password confirmation error message
     * when the user starts typing in the password confirmation field.
     */
    document.getElementById("user_password_confirm").addEventListener('keyup', function () {
        if (document.getElementById('confirm-input').classList.contains('red_underline')) {
            document.getElementById('confirm-input').classList.remove('red_underline');
            document.getElementById('password-error').classList.add('d_none');
        }
    });

    /**
     * Removes the red underline and hides the email error message
     * when the user starts typing in the email input field.
     */
    document.getElementById("user_email").addEventListener('keyup', function () {
        if (document.getElementById('email-input').classList.contains('red_underline')) {
            document.getElementById('email-input').classList.remove('red_underline');
            document.getElementById('email-error').classList.add('d_none');
        }
    });

    /**
     * Validates the form before submission.
     * Prevents form submission if the form is not valid.
     */
    document.getElementById("myForm").addEventListener("submit", function (event) {
        const form = document.getElementById("myForm");
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });

    /**
     * Handles the resize event on the window, triggering the checkOrientation function.
     * 
     * @event
     */
    window.addEventListener('resize', checkOrientation);

    /**
     * Handles the orientationchange event on the window, triggering the checkOrientation function.
     * 
     * @event
     */
    window.addEventListener('orientationchange', checkOrientation);

    checkOrientation();
    setInterval(checkOrientation, 500);
});