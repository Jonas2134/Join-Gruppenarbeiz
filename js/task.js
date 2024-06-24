let assignedContacts = [];
let subtasks = [];
let sendTaskStatus = 'To do';

function addOffSetToHeight(divWithOffset, divToAdd) {
  if (divWithOffset && divToAdd) {
    let height = divWithOffset.offsetHeight;
    divToAdd.style.marginTop = height + 'px';
  } else {
    divToAdd.style.marginTop = '0px';
  }
}

async function init() {
  includeHTML();
  checkFirstPage();
  setTimeout(() => {
    addTaskContacs();
  }, 1000);
  await loadCurrentUsers();
  showDropUser();
  document.getElementById("log_out").addEventListener('click', logOut);
  document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);
  window.addEventListener('click', function (event) {
    if (!event.target.matches('.drop-logo')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  });
  console.log(window.location.port);
}

//SEND TASK TO FIREBASE
async function sendTask(id) {
  let task = getTaskFromForm();

  if (id) {
    let updatingTask = getTaskbyId(id);
    if (updatingTask.finishedSubtasks) {
      task.finishedSubtasks = updatingTask.finishedSubtasks;
    }    
    task.status = updatingTask.status;
    await updateTaskById(id, task);
  } else {
    await postData('/tasks', task);
  }  
  clearAddTask();
  add_animations();
  redirect();
}

function getTaskFromForm() {
  let task = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    dueDate: document.getElementById('taskDueDate').value,
    priority: getPriority(),
    assignedTo: assignedContacts,
    content: document.getElementById('addCategoryInputField').innerHTML,
    subtasks: subtasks,
    status: sendTaskStatus
  };

  return task;
}

//SELECT PRIORITY BUTTON
function selectPriority(priority) {
  clearPriority(false);
  if (priority.toLowerCase() == 'urgent') {
    urgentPriority.classList.add('priority_active');
    mediumPriority.classList.add('priority_inactive');
    lowPriority.classList.add('priority_inactive');
    document.getElementById('prioRed').src = './img/prio_red_white.png';
  } else if (priority.toLowerCase() == 'medium') {
    clearPriority(true);
  } else if (priority.toLowerCase() == 'low') {
    lowPriority.classList.add('priority_active');
    urgentPriority.classList.add('priority_inactive');
    mediumPriority.classList.add('priority_inactive');
    document.getElementById('prioGreen').src = './img/prio_green_white.png';
  }
}

function clearPriority(reset) {
  let urgentPriority = document.getElementById('urgentPriority');
  let mediumPriority = document.getElementById('mediumPriority');
  let lowPriority = document.getElementById('lowPriority');

  urgentPriority.classList.remove('priority_inactive', 'priority_active');
  mediumPriority.classList.remove('priority_active', 'priority_inactive');
  lowPriority.classList.remove('priority_active', 'priority_inactive');
  document.getElementById('prioRed').src = './img/prio_red.png';
  document.getElementById('prioOrange').src = './img/prio_orange.png';
  document.getElementById('prioGreen').src = './img/prio_green.png';

  if (reset) {
    mediumPriority.classList.add('priority_active');
    urgentPriority.classList.add('priority_inactive');
    lowPriority.classList.add('priority_inactive');
    document.getElementById('prioOrange').src = './img/prio_orange_white.png';
  }
}

function getPriority() {
  if (
    document.getElementById('urgentPriority').classList.contains('priority_active')
  ) {
    return 'Urgent';
  } else if (
    document.getElementById('mediumPriority').classList.contains('priority_active')
  ) {
    return 'Medium';
  } else if (
    document.getElementById('lowPriority').classList.contains('priority_active')
  ) {
    return 'Low';
  }
}

//TOGGLE CONTACTS DROPDOWN
function toggleContacsDropdown() {
  let content = document.getElementById('assignedDropdown');
  let category = document.getElementById('addCategory');
  let otherDropdown = document.getElementById('categoryDropdown');
  
  if (otherDropdown && otherDropdown.classList.contains('show')) {
    otherDropdown.classList.remove('show');
    addOffSetToHeight('', document.getElementById('add_subtasks'));
  }
  if (content) {
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      addOffSetToHeight('', category);
    } else {
      content.classList.add('show');
      addOffSetToHeight(content, category);
    }
  }  
  event.stopPropagation();
}

//TOGGLE CATEGORY DROPDOWN
function toggleCategoryDropdown() {
  let content = document.getElementById('categoryDropdown');
  let addSubtasks = document.getElementById('add_subtasks');
  let otherDropdown = document.getElementById('assignedDropdown');
  
  if (otherDropdown && otherDropdown.classList.contains('show')) {
    otherDropdown.classList.remove('show');
    addOffSetToHeight('', document.getElementById('addCategory'));
  }
  if (content) {
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      addOffSetToHeight('', addSubtasks);
    } else {
      content.classList.add('show');
      addOffSetToHeight(content, addSubtasks);
    }
  }
  event.stopPropagation();
}

//CLOSE DROPDOWNS IF CLICKED OUTSIDE
document.addEventListener('click', function(event) {
  ['assignedDropdown', 'categoryDropdown'].forEach(id => {
    let dropdown = document.getElementById(id);
    let offsetDivId = id === 'assignedDropdown' ? 'addCategory' : 'add_subtasks';
    if (dropdown && !dropdown.contains(event.target) && !event.target.closest(`#${id.replace('Dropdown', '')}`)) {
      dropdown.classList.remove('show');
      addOffSetToHeight('', document.getElementById(offsetDivId));
    }
  });
});

//ADD CONTACTS
async function addTaskContacs() {
  await initContacts();
  let contactDropwdown = document.getElementById('assignedDropdown');
  contactDropwdown.innerHTML = '';
  for (i = 0; i < contacts.length; i++) {
    const contact = contacts[i];    
    contactDropwdown.innerHTML += templateBuildContactDropdown(contact, true);
  }
}

function selectContact(contactId) {
  let assignedContact = document.getElementById(contactId);
  let index = assignedContacts.indexOf(contactId);
  let checkbox = document.getElementById('cb' + contactId);
  if (index == -1) {
    assignedContacts.push(contactId);
    assignedContact.classList.add('active');
    checkbox.checked = true;
  } else {
    assignedContacts.splice(assignedContacts.indexOf(contactId), 1);
    assignedContact.classList.remove('active');
    checkbox.checked = false;
  }
  renderAssignedContact();
}

//RENDER CONTACTS
function renderAssignedContact() {
  let content = document.getElementById('selectedContact');
  content.innerHTML = '';
  for (let i = 0; i < assignedContacts.length; i++) {
    content.innerHTML += templateUserInitials(
      getContactById(assignedContacts[i])
    );
  }
}

// SELECT CATEGORY
function selectCategory(text) {
  let inputField = document.getElementById('addCategoryInputField');
  inputField.innerHTML = text;
}

//ADD SUBTASKS
function addSubtask() {
  let subtaskInput = document.getElementById('inputSubtasks');
  let subtask = subtaskInput.value.trim();
  if (subtask === '') return;
  subtasks.push(subtask);
  renderSubtasks();
  clearInput('inputSubtasks');
  onInputSubtask();
}

//RENDER SUBTASKS
function renderSubtasks() {
  let subtaskContent = document.getElementById('subtaskContent');
  subtaskContent.innerHTML = '';
  subtasks.forEach((subtask, index) => {
    subtaskContent.innerHTML += templateBuildSubtask(subtask, index);
  });
}

//DELETE SUBTASKS
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

//EDIT SUBTASKS
function editSubtask(index) {
  let subTaskContent = document.getElementById(`subtask_${index}`);
  let subTaskText = document.getElementById(`subtask_edit_${index}`);
  subTaskContent.classList.add('inactive');
  subTaskText.classList.remove('inactive');
}

function onInputSubtask() {
  let subtaskInput = document.getElementById('inputSubtasks').value;
  let subtaskIconActive = document.getElementById('subtaskIconsActive');
  let subtaskIconInactive = document.getElementById('subtaskIconsInactive');
  if (subtaskInput.trim() !== '') {
    subtaskIconActive.classList.add('inactive');
    subtaskIconInactive.classList.remove('inactive');
  } else {
    subtaskIconActive.classList.remove('inactive');
    subtaskIconInactive.classList.add('inactive');
  }
}

//SAVE SUBTASKS
function saveSubtask(index) {
  let subtaskInput = document.getElementById(`subtask_input_${index}`).value;
  if (subtaskInput !== null && subtaskInput.trim() !== '') {
    subtasks[index] = subtaskInput.trim();
    renderSubtasks();
  }
}

//CLEAR ADD TASK FORMULAR
function clearInput(id) {
  document.getElementById(id).value = '';
}

function clearHtml(id, html) {
  document.getElementById(id).innerHTML = html;
}

function clearAddTask() {
  clearInput('taskTitle');
  clearInput('taskDescription');
  clearInput('taskDueDate');
  clearPriority(true);
  clearHtml('selectAssignedTo', `Select contacts to assign`);
  assignedContacts = [];
  renderAssignedContact();
  clearHtml('addCategoryInputField', `Select task category`);
  clearInput('inputSubtasks');
  clearHtml('subtaskContent', '');
  subtasks = [];
}

function add_animations() {
  document.getElementsByClassName('hidden_container')[0].classList.add('visible');
  document.getElementsByClassName('hidden_popup')[0].classList.add('visible');

  setTimeout(() => {
    document.getElementsByClassName('hidden_container')[0].classList.remove('visible');
    document.getElementsByClassName('hidden_popup')[0].classList.remove('visible');
  }, 2000);
}

//FORM VALIDATION
function validateForm() {
  let form = document.getElementById('myForm');

  if (form.checkValidity()) {
    sendTask();
  } else {
    form.reportValidity();
  }
}

function validateFormOverlay() {
  let form = document.getElementById('myForm');
  if (form.checkValidity()) {
    sendTask();
    closeOverlayRight();
    showTasks(false);
  } else {
    form.reportValidity();
  }
}

//REDIRECT FUNKTION
function redirect() {
  var hostname = window.location.hostname;
  var port = window.location.port;
  var targetUrl = 'https://' + hostname;
  if (port) {
      targetUrl += ':' + port;
  }
  targetUrl += '/board.html';
  console.log(targetUrl);
  setTimeout(function() {
      window.location.href = targetUrl;
  }, 1000);
}