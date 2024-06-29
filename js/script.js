/**
 * Base URL for Firebase Realtime Database where data is stored.
 * @constant {string} STORAGE_URL
 */
const STORAGE_URL =
  'https://join-gruppenarbeit-c2942-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Array to store user objects retrieved from the database.
 * @type {Array}
 */
const users = [];

/**
 * Array to store contact objects retrieved from the database.
 * @type {Array}
 */
let contacts = [];

/**
 * Variable to store the currently logged-in user object.
 * @type {Object|null}
 */
let currentUser = null;

/**
 * Array of colors used for task categories or other visual elements.
 * @type {Array<string>}
 */
const colors = ['#fe7b02', '#9228ff', '#6e52ff', '#fc71ff', '#ffbb2b', '#21d7c2', '#462f89', '#ff4646'];

/**
 * Array to store task objects retrieved from the database.
 * @type {Array}
 */
let tasks = [];

/**
 * Deletes an item from an array based on its ID.
 *
 * @param {Array} array - The array from which to delete an item.
 * @param {string} idToDelete - The ID of the item to delete.
 * @returns {Array} - The updated array after deletion.
 */
function deleteById(array, idToDelete) {
  return array.filter(item => item.id !== idToDelete);
}

/**
 * Updates data in the Firebase Realtime Database at a specified path.
 *
 * @async
 * @param {string} [path=''] - The path in the database where data should be updated.
 * @param {Object} [data={}] - The data object to update in the database.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function updateData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Posts new data to the Firebase Realtime Database at a specified path.
 *
 * @async
 * @param {string} [path=''] - The path in the database where data should be posted.
 * @param {Object} [data={}] - The data object to post to the database.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function postData(path = '', data = {}) {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Retrieves data from the Firebase Realtime Database at a specified path.
 *
 * @async
 * @param {string} [path=''] - The path in the database from which to retrieve data.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function getData(path = "") {
  let response = await fetch(STORAGE_URL + path + ".json");
  return await response.json();
}

/**
 * Deletes data from the Firebase Realtime Database at a specified path.
 *
 * @async
 * @param {string} [path=''] - The path in the database from which to delete data.
 * @returns {Promise<Object>} - A promise that resolves to the JSON response from the server.
 */
async function deleteData(path = '') {
  let response = await fetch(STORAGE_URL + path + '.json', {
    method: 'DELETE',
  });
  return await response.json();
}

/**
 * Loads all tasks from the '/tasks' path in the Firebase Realtime Database.
 * Updates the global `tasks` array with the retrieved tasks.
 *
 * @async
 */
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

/**
 * Deletes a task from the Firebase Realtime Database and updates the `tasks` array.
 *
 * @async
 * @param {string} taskId - The ID of the task to delete.
 */
async function deleteTaskById(taskId) {
  await deleteData('/tasks/' + taskId);
  tasks = tasks.filter(task => task.id !== taskId);
}

/**
 * Updates a task in the Firebase Realtime Database at a specified path.
 *
 * @async
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} task - The updated task object to store in the database.
 */
async function updateTaskById(taskId, task) {
  await updateData('/tasks/' + taskId, task);
}

/**
 * Retrieves a contact object from the `contacts` array based on the provided ID.
 *
 * @param {string} id - The ID of the contact to retrieve.
 * @returns {Object|undefined} - The contact object matching the ID, or undefined if not found.
 */
function getContactById(id) {
  return contacts.find((obj) => obj.id === id);
}

/**
 * Retrieves a task object from the `tasks` array based on the provided ID.
 *
 * @param {string} id - The ID of the task to retrieve.
 * @returns {Object|undefined} - The task object matching the ID, or undefined if not found.
 */
function getTaskbyId(id) {
  return tasks.find((obj) => obj.id === id);
}

/**
 * Loads all user objects from the '/users' path in the Firebase Realtime Database.
 * Updates the global `users` array with the retrieved users.
 *
 * @async
 */
async function loadUsers() {
  let loadedUsers = await getData('/users');
  for (const key in loadedUsers) {
    if (Object.hasOwnProperty.call(loadedUsers, key)) {
      users.push(loadedUsers[key]);
    }
  }
}

/**
 * Loads the current user object from the '/currentUser' path in the Firebase Realtime Database.
 * Updates the global `currentUser` variable with the retrieved user.
 *
 * @async
 */
async function loadCurrentUsers() {
  let loadedCurrentUser = await getData('/currentUser');
  for (const key in loadedCurrentUser) {
    if (Object.hasOwnProperty.call(loadedCurrentUser, key)) {
      currentUser = loadedCurrentUser[key];
    }
  }
}

/**
 * Initializes contacts by loading, sorting, and enriching them with initials and colors.
 * This function is typically called during application initialization.
 *
 * @async
 */
async function initContacts() {
  await loadContacts();
  sortContacts();
  enrichContacts();
}

/**
 * Sorts the contacts array alphabetically by their 'name' property.
 */
function sortContacts() {
  contacts.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });
}

/**
 * Generates initials from a given name.
 *
 * @param {string} name - The full name from which to generate initials.
 * @returns {string} - The initials generated from the name.
 */
function getInitials(name) {
  let parts = name.split(' ');
  let initials = '';
  for (let i = 0; i < parts.length; i++) {
    initials += parts[i].charAt(0).toUpperCase();
  }
  return initials;
}

/**
 * Enriches each contact object with initials and a color from the predefined colors array.
 * The colors are assigned based on the index of the contact in the contacts array.
 */
function enrichContacts() {
  let colorIndex = 0;
  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    contact.initials = getInitials(contact.name);
    contact.color = colors[colorIndex % colors.length];
    colorIndex++;
  }
}

/**
 * Updates the user interface to display the initials of the current user.
 * This function assumes `currentUser` is already loaded.
 */
function showDropUser() {
  if (currentUser) {
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
}

/**
 * Logs out the current user by deleting their data from the database and clearing local storage.
 * Redirects the user to the login page after logout.
 *
 * @async
 */
async function logOut() {
  await deleteData("/currentUser");
  localStorage.removeItem('isLoggedIn');
  window.location.href = './index.html';
}

/**
 * Loads contacts from the '/contacts' path in the Firebase Realtime Database and populates the global `contacts` array.
 *
 * @async
 */
async function loadContacts() {
  contacts = [];

  const loadedContacts = await getData("/contacts");
  Object.keys(loadedContacts).forEach(key => {
    const contact = { id: key, ...loadedContacts[key] };
    contacts.push(contact);
  });
}

/**
 * Checks if the user is logged in based on the presence of 'isLoggedIn' in localStorage.
 * If the user is not logged in and the current page is not '/index.html', redirects
 * the user to the login page ('index.html').
 */
function checkFirstPage() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const path = window.location.pathname;

  if (!isLoggedIn && path !== '/index.html') {
    window.location.href = 'index.html';
  }
}

/**
 * Hides elements with the class 'hide-if-logged-out' if the user is not logged in.
 * Returns true if the user is logged in, and false otherwise.
 *
 * @returns {boolean} True if the user is logged in, false otherwise.
 */
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

function checkOrientation() {  
  if (isMobileDevice() && window.innerHeight < window.innerWidth) {
    document.getElementById('landscape_format_message').classList.add('hidden');
    document.getElementById('landscape_format_message_container').classList.add('hidden');
  } else {
    document.getElementById('landscape_format_message').classList.remove('hidden');
    document.getElementById('landscape_format_message_container').classList.remove('hidden');
  }
}

function isMobileDevice() {
  return /Mobi|Android/i.test(navigator.userAgent);
}