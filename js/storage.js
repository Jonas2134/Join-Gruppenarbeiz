const STORAGE_URL =
  'https://join-gruppenarbeit-c2942-default-rtdb.europe-west1.firebasedatabase.app/';
const users = [];
let currentUser = null;

const contacts = [];
let groupedContacts = {};

let tasks = [];

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
  // maxID oops
  /*     let maxTaskId = await getMaxTaskId();
    console.log(maxTaskId);
    let currentTask = '';
    for (let index = 0; index <= maxTaskId; index++) {
        currentTask = await getData('/task/' + index + '/task');
        console.log(currentTask);
        for (const key in currentTask) {
            if (Object.hasOwnProperty.call(currentTask, key)) {
                tasks.push(currentTask[key]);
            }
        }        
    } */
  let allTask = await getData('/tasks');
  for (const key in allTask) {
    if (Object.hasOwnProperty.call(allTask, key)) {
      tasks.push(allTask[key]);
    }
  }
}

// Funktion zum Testdaten resetten
// maxID oops
/* async function resetMaxTaskId() {
    let json = {
        maxTaskId: 0
    };
    console.log(json);
    await deleteData('/maxTask');
    await postData('/maxTask', json);
}

async function setMaxTaskId(id) {
    let json = {
        maxTaskId: 0
    }
    json.maxTaskId = id;
    updateData('/maxTask', json);
}

async function getMaxTaskId() {
    let idJson = await getData('/maxTask');
    for (const key in idJson) {
        if (Object.hasOwnProperty.call(idJson, key)) {
            return(idJson[key].maxTaskId);
        }
    }
} */

async function loadUsers() {
  let loadedUsers = await getData('/users');
  for (const key in loadedUsers) {
    if (Object.hasOwnProperty.call(loadedUsers, key)) {
      users.push(loadedUsers[key]);
    }
  }
}

async function loadContacts() {
  let loadedContacts = await getData('/contacts');
  for (const key in loadedContacts) {
    if (Object.hasOwnProperty.call(loadedContacts, key)) {
      contacts.push(loadedContacts[key]);
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
