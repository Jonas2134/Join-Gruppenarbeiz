let assignedContacts = [];
let subtasks = [];
let sendTaskStatus = 'To do';

/**
 * Initializes the current user and sets up the task form.
 */
async function init() {
  await initCurrentUser();

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
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  checkOrientation();
  setInterval(checkOrientation, 500);  

  setDateRestriction('taskDueDate');
}

/**
 * Sends a task to the server (e.g., Firebase). If an ID is provided, the task is updated; otherwise, a new task is created.
 *
 * @param {string} [id] - The ID of the task to update (optional).
 */
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

/**
 * Retrieves task data from the form fields.
 *
 * @returns {Object} - The task object.
 */
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

/**
 * Selects the priority of the task based on the provided priority level.
 *
 * @param {string} priority - The priority level (Urgent, Medium, Low).
 */
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

/**
 * Resets the priority in the add task form to the default state.
 */
function resetPriorityDOM() {
  mediumPriority.classList.add('priority_active');
  urgentPriority.classList.add('priority_inactive');
  lowPriority.classList.add('priority_inactive');
  document.getElementById('prioOrange').src = './img/prio_orange_white.png';
}

/**
 * Clears the priority selections in the add task form.
 *
 * @param {boolean} reset - If true, reset the priority to default state.
 */
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
    resetPriorityDOM();
  }
}

/**
 * Gets the selected priority in the add task form.
 *
 * @returns {string} - The priority level ('Urgent', 'Medium', 'Low').
 */
function getPriority() {
  if (document.getElementById('urgentPriority').classList.contains('priority_active')) {
    return 'Urgent';
  } else if (document.getElementById('mediumPriority').classList.contains('priority_active')) {
    return 'Medium';
  } else if (document.getElementById('lowPriority').classList.contains('priority_active')) {
    return 'Low';
  }
}

/**
 * Closes other dropdowns if they are open.
 *
 * @param {HTMLElement} otherDropdown - The other dropdown element.
 * @param {string} id - The ID of the element to adjust height.
 */
function closeOtherDropdown(otherDropdown, id) {
  if (otherDropdown && otherDropdown.classList.contains('show')) {
    otherDropdown.classList.remove('show');
    addOffSetToHeight('', document.getElementById(id));
  }
}

/**
 * Toggles the display of the contacts dropdown.
 */
function toggleContacsDropdown() {
  let content = document.getElementById('assignedDropdown');
  let category = document.getElementById('addCategory');
  let otherDropdown = document.getElementById('categoryDropdown');

  closeOtherDropdown(otherDropdown, 'add_subtasks');
  if (content.classList.contains('show')) {
    content.classList.remove('show');
    addOffSetToHeight('', category);
  } else {
    content.classList.add('show');
    addOffSetToHeight(content, category);
  }
  event.stopPropagation();
}

/**
 * Toggles the display of the category dropdown.
 */
function toggleCategoryDropdown() {
  let content = document.getElementById('categoryDropdown');
  let addSubtasks = document.getElementById('add_subtasks');
  let otherDropdown = document.getElementById('assignedDropdown');

  closeOtherDropdown(otherDropdown, 'addCategory');
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

/**
 * Closes dropdowns if clicked outside of them.
 */
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

/**
 * Adds offset height to the specified div based on another div's height.
 *
 * @param {HTMLElement} divWithOffset - The div to get height from.
 * @param {HTMLElement} divToAdd - The div to apply the offset height.
 */
function addOffSetToHeight(divWithOffset, divToAdd) {
  if (divWithOffset && divToAdd) {
    let height = divWithOffset.offsetHeight;
    divToAdd.style.marginTop = height + 'px';
  } else {
    divToAdd.style.marginTop = '0px';
  }
}

/**
 * Adds contacts to the task form's contacts dropdown.
 */
async function addTaskContacs() {
  await initContacts();
  let contactDropdown = document.getElementById('assignedDropdown');
  contactDropdown.innerHTML = '';
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    contactDropdown.innerHTML += templateBuildContactDropdown(contact, true);
  }
}

/**
 * Selects or deselects a contact for the task.
 *
 * @param {string} contactId - The ID of the contact to select or deselect.
 */
function selectContact(contactId) {
  let assignedContact = document.getElementById(contactId);
  let index = assignedContacts.indexOf(contactId);
  let checkbox = document.getElementById('cb' + contactId);
  if (index === -1) {
    assignedContacts.push(contactId);
    assignedContact.classList.add('active');
    checkbox.checked = true;
  } else {
    assignedContacts.splice(index, 1);
    assignedContact.classList.remove('active');
    checkbox.checked = false;
  }
  renderAssignedContact();
}

/**
 * Renders the selected contacts for the task.
 */
function renderAssignedContact() {
  let content = document.getElementById('selectedContact');
  content.innerHTML = '';
  for (let i = 0; i < assignedContacts.length; i++) {
    content.innerHTML += templateUserInitials(getContactById(assignedContacts[i]));
  }
}

/**
 * Selects a category for the task.
 *
 * @param {string} text - The category text to select.
 */
function selectCategory(text) {
  let inputField = document.getElementById('addCategoryInputField');
  inputField.innerHTML = text;
}

/**
 * Adds a subtask to the task.
 */
function addSubtask() {
  let subtaskInput = document.getElementById('inputSubtasks');
  let subtask = subtaskInput.value.trim();
  if (subtask === '') return;
  subtasks.push(subtask);
  renderSubtasks();
  clearInput('inputSubtasks');
  onInputSubtask();
}

/**
 * Renders the subtasks in the task.
 */
function renderSubtasks() {
  let subtaskContent = document.getElementById('subtaskContent');
  subtaskContent.innerHTML = '';
  subtasks.forEach((subtask, index) => {
    subtaskContent.innerHTML += templateBuildSubtask(subtask, index);
  });
}
  
/**
 * Deletes a subtask from the task.
 *
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtask(index) {
  subtasks.splice(index, 1);
  renderSubtasks();
}

/**
 * Edits a subtask in the task.
 *
 * @param {number} index - The index of the subtask to edit.
 */
function editSubtask(index) {
  let subTaskContent = document.getElementById(`subtask_${index}`);
  let subTaskText = document.getElementById(`subtask_edit_${index}`);
  subTaskContent.classList.add('inactive');
  subTaskText.classList.remove('inactive');
}

/**
 * Handles the input event for the subtask input field.
 */
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

/**
 * Saves the edited subtask.
 *
 * @param {number} index - The index of the subtask to save.
 */
function saveSubtask(index) {
  let subtaskInput = document.getElementById(`subtask_input_${index}`).value;
  if (subtaskInput !== null && subtaskInput.trim() !== '') {
    subtasks[index] = subtaskInput.trim();
    renderSubtasks();
  }
}

/**
 * Clears the entire Add Task form.
 */
function clearAddTask() {
  clearInput('taskTitle');
  clearInput('taskDescription');
  clearInput('taskDueDate');
  clearPriority(true);
  clearHtml('selectAssignedTo', 'Select contacts to assign');
  assignedContacts = [];
  renderAssignedContact();
  clearHtml('addCategoryInputField', 'Select task category');
  clearInput('inputSubtasks');
  clearHtml('subtaskContent', '');
  subtasks = [];
}

/**
 * Adds animations for sending the task.
 */
function add_animations() {
  document.getElementsByClassName('hidden_container')[0].classList.add('visible');
  document.getElementsByClassName('hidden_popup')[0].classList.add('visible');

  setTimeout(() => {
    document.getElementsByClassName('hidden_container')[0].classList.remove('visible');
    document.getElementsByClassName('hidden_popup')[0].classList.remove('visible');
  }, 2000);
}

/**
 * Redirects from the added task to the board.
 */
function redirect() {
  var hostname = window.location.hostname;
  var port = window.location.port;
  var targetUrl = 'https://' + hostname;
  if (port) {
      targetUrl += ':' + port;
  }
  targetUrl += '/board.html';
  setTimeout(function() {
      window.location.href = targetUrl;
  }, 1000);
}