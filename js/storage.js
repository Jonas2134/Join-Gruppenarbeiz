const STORAGE_URL = "https://join-gruppenarbeit-c2942-default-rtdb.europe-west1.firebasedatabase.app/";
const users = [];
let currentUser = null;

async function postData(path = "", data = {}) {
    let response = await fetch(STORAGE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    return (responseToJson = await response.json());
}

async function getData(path = "") {
    let response = await fetch(STORAGE_URL + path + ".json");
    return (responseToJson = await response.json());
}

async function deleteData(path = "") {
    let response = await fetch(STORAGE_URL + path + ".json", {
        method: "DELETE",
    });
    return (responseToJson = await response.json());
}

async function loadUsers() {
    let loadedUsers = await getData("/users");
    for (const key in loadedUsers) {
        if (Object.hasOwnProperty.call(loadedUsers, key)) {
            users.push(loadedUsers[key]);
        }
    }
}

async function loadCurrentUsers() {
    let loadedCurrentUser = await getData("/currentUser");
    for (const key in loadedCurrentUser) {
        if (Object.hasOwnProperty.call(loadedCurrentUser, key)) {
            currentUser = loadedCurrentUser[key];
        }
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

async function logOut() {
    await deleteData("/currentUser");
    window.location.href = './index.html';
}