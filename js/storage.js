const STORAGE_URL = "https://users-31ee0-default-rtdb.europe-west1.firebasedatabase.app/";
const users = [];
const contacts = [];
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

async function updateData(path = "/contacts/-NzmQdORn2MvEaSCXK13", data = {}) {
    let response = await fetch(STORAGE_URL + path + ".json", {
        method: "PUT",
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

async function loadContacts() {
    let loadedContacts = await getData("/contacts");
    for (const key in loadedContacts) {
        if (Object.hasOwnProperty.call(loadedContacts, key)) {
            contacts.push(loadedContacts[key]);
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

function showDropUser() {
    const name = currentUser.user_name.split(" ");
    let initials;

    if (name.length === 1) {
        initials = name[0].charAt(0).toUpperCase();
    } else {
        const firstNameLetter = name[0].charAt(0).toUpperCase();
        const lastNameLetter = name[name.length - 1].charAt(0).toUpperCase();
        initials = firstNameLetter + lastNameLetter;
    }

    document.getElementById("drop_user").innerHTML = initials;
}

async function logOut() {
    await deleteData("/currentUser");
    window.location.href = './index.html';
}