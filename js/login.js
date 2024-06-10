function loginError() {
    document.getElementById('login-error').classList.remove('d_none');
    document.getElementById('password-input').classList.add('red_underline');
    document.getElementById('email-input').classList.add('red_underline');
}

function removeClasses() {
    document.getElementById('email-input').classList.remove('red_underline');
    document.getElementById('password-input').classList.remove('red_underline');

    if (!document.getElementById('login-error').classList.contains('d_none') &&
        !document.getElementById('email-input').classList.contains('red_underline') &&
        !document.getElementById('password-input').classList.contains('red_underline')) {

        document.getElementById('login-error').classList.add('d_none');
    }
}

function populateRememberMe() {
    const userData = getCookie("currentUser");
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById("user_email").value = user.email;
        document.getElementById("user_password").value = user.password;
        document.getElementById("remember_me").checked = true;        
    }
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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

function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

document.addEventListener("DOMContentLoaded", async function () {
    await loadUsers();
    await loadCurrentUsers();
    populateRememberMe();

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
                setCookie("currentUser", JSON.stringify({ email: email , password: password }), 7);
            } else {
                eraseCookie("currentUser");
            }

            await deleteData("/currentUser");
            await postData("/currentUser", currentUser);
            window.location.href = 'summary.html';
        } else {
            loginError();
        }
    });

    document.getElementById("guest_login").addEventListener("click", async function () {
        currentUser = { user_name: "Guest User" };
        await deleteData("/currentUser");
        await postData("/currentUser", currentUser);
        window.location.href = 'summary.html';
    })

    document.getElementById("myForm").addEventListener("submit", function (event) {
        const form = document.getElementById("myForm");
        if (!form.checkValidity()) {
            event.preventDefault();
        }
    });

    document.getElementById('user_email').addEventListener('keyup', removeClasses);

    document.getElementById('user_password').addEventListener('keyup', removeClasses);
});