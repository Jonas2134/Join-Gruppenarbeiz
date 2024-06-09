/* const STORAGE_URL = "https://join-gruppenarbeit-c2942-default-rtdb.europe-west1.firebasedatabase.app/"; */
const users = [];
let currentUser = null;
const contacts = [];

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