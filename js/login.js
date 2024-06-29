/**
 * Shows the login error message and adds a red underline to the email and password input fields.
 */
function loginError() {
    document.getElementById('login-error').classList.remove('d_none');
    document.getElementById('password-input').classList.add('red_underline');
    document.getElementById('email-input').classList.add('red_underline');
}

/**
 * Removes the red underline from the email and password input fields.
 * Hides the login error message if the underline is removed from both fields.
 */
function removeClasses() {
    document.getElementById('email-input').classList.remove('red_underline');
    document.getElementById('password-input').classList.remove('red_underline');

    if (!document.getElementById('login-error').classList.contains('d_none') &&
        !document.getElementById('email-input').classList.contains('red_underline') &&
        !document.getElementById('password-input').classList.contains('red_underline')) {

        document.getElementById('login-error').classList.add('d_none');
    }
}

/**
 * Populates the email and password fields with the user's data from the "currentUser" cookie.
 * Checks the "remember me" checkbox if the user data is found in the cookie.
 */
function populateRememberMe() {
    const userData = getCookie("currentUser");
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById("user_email").value = user.email;
        document.getElementById("user_password").value = user.password;
        document.getElementById("remember_me").checked = true;
    }
}

/**
 * Sets a cookie with the given name and value for the specified number of days.
 * 
 * @param {string} name - The name of the cookie.
 * @param {string} value - The value of the cookie.
 * @param {number} [days] - The number of days until the cookie expires.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Retrieves the value of the cookie with the specified name.
 * 
 * @param {string} name - The name of the cookie.
 * @returns {string|null} - The value of the cookie, or null if the cookie does not exist.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Erases the cookie with the specified name.
 * 
 * @param {string} name - The name of the cookie to erase.
 */
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUsers();
    await loadCurrentUsers();
    populateRememberMe();

    /**
     * Handles the form submission for login.
     * Validates the user credentials and sets the "currentUser" cookie if "remember me" is checked.
     * Redirects to the summary page on successful login.
     * Shows an error message on failed login.
     */
    document.getElementById("myForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(document.getElementById("myForm"));
        const email = formData.get("user_email");
        const password = formData.get("user_password");
        const rememberMe = formData.get("remember_me_checkbox") === "on";

        let found = false;

        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            if (user.user_email === email && user.user_password === password) {
                currentUser = user;
                found = true;
                break;
            }
        }

        if (found) {
            if (rememberMe) {
                setCookie("currentUser", JSON.stringify({ email: email, password: password }), 7);
            } else {
                eraseCookie("currentUser");
            }
            await deleteData("/currentUser");
            await postData("/currentUser", currentUser);
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'summary.html';
        } else {
            loginError();
        }
    });

    /**
     * Handles the guest login button click.
     * Sets the current user as "Guest User" and redirects to the summary page.
     */
    document.getElementById("guest_login").addEventListener("click", async function () {
        currentUser = { user_name: "Guest User" };
        await deleteData("/currentUser");
        await postData("/currentUser", currentUser);
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'summary.html';
    })

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
    document.getElementById('user_email').addEventListener('keyup', removeClasses);

    /**
     * Handles the orientationchange event on the window, triggering the checkOrientation function.
     * 
     * @event
     */
    document.getElementById('user_password').addEventListener('keyup', removeClasses);

    // Event listeners for orientation change
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    checkOrientation();
    setInterval(checkOrientation, 500);
});