const STORAGE_URL =
  'https://join-gruppenarbeit-c2942-default-rtdb.europe-west1.firebasedatabase.app/';
// 'https://users-31ee0-default-rtdb.europe-west1.firebasedatabase.app/';
const users = [];
let contacts = [];
let currentUser = null;
const colors = ['#fe7b02', '#9228ff', '#6e52ff', '#fc71ff', '#ffbb2b', '#21d7c2', '#462f89', '#ff4646']
let tasks = [];

function deleteById(array, idToDelete) {
  return array.filter(item => item.id !== idToDelete);
}

async function updateData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'PUT',
    header: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function postData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

async function updateData(path = "", data = {}) {
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

async function getData(path = '') {
  let response = await fetch(STORAGE_URL + path + '.json');
  return (responseToJson = await response.json());
}

async function deleteData(path = '') {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'DELETE',
  });
  return (responseToJson = await response.json());
}

async function loadTasks() {
  let allTask = await getData('/tasks');
  tasks = [];
  for (const key in allTask) {
    if (Object.hasOwnProperty.call(allTask, key)) {
      allTask[key].id = key;
      tasks.push(allTask[key]);
    }
  }
}

async function deleteTaskById(taskId) {
  await deleteData('/tasks/' + taskId);
  tasks = tasks.filter(task => task.id !== taskId);
}

async function updateTaskById(taskId, task) {
  await updateData('/tasks/' + taskId, task);
}

function getContactById(id) {
  return contacts.find((obj) => obj.id === id);
}

function getTaskbyId(id) {
  return tasks.find((obj) => obj.id === id);
}

async function loadUsers() {
  let loadedUsers = await getData('/users');
  for (const key in loadedUsers) {
    if (Object.hasOwnProperty.call(loadedUsers, key)) {
      users.push(loadedUsers[key]);
    }
  }
}

async function loadCurrentUsers() {
  let loadedCurrentUser = await getData('/currentUser');
  for (const key in loadedCurrentUser) {
    if (Object.hasOwnProperty.call(loadedCurrentUser, key)) {
      currentUser = loadedCurrentUser[key];
    }
  }
}

async function initContacts() {
  await loadContacts();
  sortContacts();
  enrichContacts();
}

//SORT CONTACTS
function sortContacts() {
  contacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

//GET INITIALS FROM CONTACT NAMES
function getInitials(name) {
  let parts = name.split(' ');
  let initials = '';
  for (let i = 0; i < parts.length; i++) {
    initials += parts[i].charAt(0).toUpperCase();
  }
  return initials;
}

//ADDED COLORS TO CONTACT ICONS
function enrichContacts() {
  let colorIndex = 0;
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    contact.initials = getInitials(contact.name);
    contact.color = colors[colorIndex % colors.length];
    colorIndex++;
  }
}

//FILTER CONTACT / USER 
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
  localStorage.removeItem('isLoggedIn');
  window.location.href = './index.html';
}



async function loadContacts() {
  contacts = [];

  const loadedContacts = await getData("/contacts");
  Object.keys(loadedContacts).forEach(key => {
    const contact = { id: key, ...loadedContacts[key] };
    contacts.push(contact);
  });
}

function checkFirstPage() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const path = window.location.pathname;

  if (!isLoggedIn && path !== '/index.html') {
    window.location.href = 'index.html';
  }
}

function hideElementsForLoggedOutUsers() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');  

  if (!isLoggedIn) {
    const elementsToHide = document.querySelectorAll('.hide-if-logged-out');
    elementsToHide.forEach(element => {
      element.style.display = 'none';
    });
    return false;
  }
  return true;
}