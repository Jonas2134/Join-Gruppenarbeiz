let assignedContacts = [];
let subtasks = [];

//SELECT PRIORITY BUTTON
function selectPriority(priority) {
  let urgentPriority = document.getElementById('urgentPriority');
  let mediumPriority = document.getElementById('mediumPriority');
  let lowPriority = document.getElementById('lowPriority');

  urgentPriority.classList.remove('priority_inactive', 'priority_active');
  mediumPriority.classList.remove('priority_active', 'priority_inactive');
  lowPriority.classList.remove('priority_active', 'priority_inactive');

  if (priority == 'urgent') {
    urgentPriority.classList.add('priority_active');
    mediumPriority.classList.add('priority_inactive');
    lowPriority.classList.add('priority_inactive');
    document.getElementById('prioRed').src = "icons/prio_red_white.png";
    document.getElementById('prioOrange').src = "icons/prio_orange.png";
    document.getElementById('prioGreen').src = "icons/prio_green.png";

  } else if (priority == 'medium') {
    mediumPriority.classList.add('priority_active');
    urgentPriority.classList.add('priority_inactive');
    lowPriority.classList.add('priority_inactive');
    document.getElementById('prioRed').src = "icons/prio_red.png";
    document.getElementById('prioOrange').src = "icons/prio_orange_white.png";
    document.getElementById('prioGreen').src = "icons/prio_green.png";

  } else if (priority == 'low') {
    lowPriority.classList.add('priority_active');
    urgentPriority.classList.add('priority_inactive');
    mediumPriority.classList.add('priority_inactive');
    document.getElementById('prioRed').src = "icons/prio_red.png";
    document.getElementById('prioOrange').src = "icons/prio_orange.png";
    document.getElementById('prioGreen').src = "icons/prio_green_white.png";
  }
}

//TOGGLE CATEGORY DROPDOWN FUNCTION
function toggleCategoryDropdown() {
  let content = document.getElementById('categoryDropdown');
  let add_subtasks = document.getElementById('add_subtasks');
  if (content) {
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      add_subtasks.style.marginTop = '0px';
    } else {
      content.classList.add('show');
      let dropdownHeight = content.offsetHeight;
      add_subtasks.style.marginTop = dropdownHeight + 'px';
    }
  }
}

//TOGGLE DROPDOWN CONTACTS FUNCTION
function toggleContacsDropdown() {
  let content = document.getElementById('assignedDropdown');
  let category = document.getElementById('addCategory');
  if (content) {
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      category.style.marginTop = '0px';
    } else {
      content.classList.add('show');
      let dropdownHeight = content.offsetHeight;
      category.style.marginTop = dropdownHeight + 'px';
    }
  }
}

async function sendTask() {
  let task = {
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    assignedTo: [],
    content: '',
    subtasks: [],
    status: 'To do',
  };

  let taskTitle = document.getElementById('taskTitle').value;
  let taskDescription = document.getElementById('taskDescription').value;
  let taskDueDate = document.getElementById('taskDueDate').value;
  let taskPriority = 'medium';
  if (
    document
      .getElementById('urgentPriority')
      .classList.contains('priority_active')
  ) {
    taskPriority = 'urgent';
  } else if (
    document
      .getElementById('mediumPriority')
      .classList.contains('priority_active')
  ) {
    taskPriority = 'medium';
  } else if (
    document.getElementById('lowPriority').classList.contains('priority_active')
  ) {
    taskPriority = 'low';
  }
  let taskContentCategory = document.getElementById(
    'addCategoryInputField'
  ).innerHTML;
  

  task.title = taskTitle;
  task.description = taskDescription;
  task.dueDate = taskDueDate;
  task.priority = taskPriority;
  task.assignedTo = assignedContacts;
  task.content = taskContentCategory;
  task.subtasks = subtasks;
 
  postData('/tasks', task);
  clearAddTask();
}



function clearInput(id) {
  document.getElementById(id).value = '';
}


function clearAddTask() {
  clearInput('taskTitle');
  clearInput('taskDescription');
  clearInput('taskDueDate');
  clearInput('inputSubtasks');

  document.getElementById('mediumPriority').classList.add('priority_active');
  document
    .getElementById('mediumPriority')
    .classList.remove('priority_inactive');
  document.getElementById('urgentPriority').classList.remove('priority_active');
  document.getElementById('urgentPriority').classList.add('priority_inactive');
  document.getElementById('lowPriority').classList.remove('priority_active');
  document.getElementById('lowPriority').classList.add('priority_inactive');
  clearHtml('selectAssignedTo', `Select contacts to assign`);
    assignedContacts = [];
    renderAssignedContact();
  clearHtml('addCategoryInputField', `Select task category`);
  clearHtml('subtaskContent', '');
  subtasks = [];

  
  
}

function clearHtml(id, html) {
document.getElementById(id).innerHTML = html;
}


async function addTaskContacs() {
  await loadContacts();

  for (i = 0; i < contacts.length; i++) {
    const contact = contacts[i];

    let contactDropwdown = document.getElementById('assignedDropdown');

    contactDropwdown.innerHTML += templateBuildContactDropdown(contact);
  }
}


function templateBuildContactDropdown(contact) {
  let contactName = contact['name'];
  let contactId = contact['ID'];

  return `
        <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
        ${contactName}
        <input class="custom_checkbox" type="checkbox" id="cb${contactId}" onclick="event.stopPropagation();">
        </li>
        `;
}



function selectContact(contactId) {
  let assignedContact = document.getElementById(contactId);
  let index = assignedContacts.indexOf(contactId);
  let checkbox = document.getElementById('cb' + contactId);

  if (index == -1) {
    assignedContacts.push(contactId);
    assignedContact.classList.add('active');
    checkbox.checked = !checkbox.checked;
    
  }  else {
    assignedContacts.splice(assignedContacts.indexOf(contactId), 1);
    assignedContact.classList.remove('active');
    checkbox.checked = !checkbox.checked;
  }
    renderAssignedContact();
  }


function renderAssignedContact() {
  let content = document.getElementById('selectedContact');
  content.innerHTML = ''
  for (let i = 0; i < assignedContacts.length; i++) {
    content.innerHTML += getContactById(assignedContacts[i])['name'];     
  }
  
}

function getContactById(Id) {
  return contacts.find(obj => obj.ID === Id);
}



function addSubtask() {
  let subtaskInput = document.getElementById('inputSubtasks');
  let subtask = subtaskInput.value.trim();
  
  if (subtask === "") return; 

  subtasks.push(subtask);
  renderSubtasks();
  clearInput('inputSubtasks');
  onInputSubtask();
}




function deleteSubtask(index) {
  subtasks.splice(index, 1);
    renderSubtasks();
}

function renderSubtasks() {
  let subtaskContent = document.getElementById('subtaskContent');
  subtaskContent.innerHTML = '';

  subtasks.forEach((subtask, index) => {
    subtaskContent.innerHTML += templateBuildSubtask(subtask, index);
});
}


function editSubtask(index) {
  let subTaskContent = document.getElementById(`subtask_${index}`);
  let subTaskText = document.getElementById(`subtask_edit_${index}`);

  subTaskContent.classList.add('inactive');
  subTaskText.classList.remove('inactive');
}

function saveSubtask(index) {
let subtaskInput = document.getElementById(`subtask_input_${index}`).value;

if (subtaskInput !== null && subtaskInput.trim() !== "") {
  subtasks[index] = subtaskInput.trim();

  renderSubtasks();
} 
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


function templateBuildSubtask(subtask, index) {
  return `
  <div class="build_subtask" id="subtask_${index}">
  <li class="build_subtask_span">${subtask}</li>
  <div class="subtask_icons_div">
  <img src="/icons/edit_icon.png" alt="edit" class="subtask_icon" onclick="editSubtask(${index})">
  <div class="subtask_divider"></div>
  <img src="/icons/delete_icon.png" alt="delete" class="subtask_icon" onclick="deleteSubtask(${index})">
  </div>
  </div>
  <div class="build_subtask_2 inactive" id="subtask_edit_${index}">
  <input class="build_subtask_span_2" value="${subtask}" id="subtask_input_${index}"></input>
  <div class="subtask_icons_div">
  <img src="/icons/delete_icon.png" alt="delete" class="subtask_icon_delete" onclick="deleteSubtask(${index})">
  <div class="subtask_divider"></div>
  <img class="subtask_check_icon" src="icons/check.png" onclick="saveSubtask(${index})">
  </div>
  </div>
  `;
}



// SELECT CATEGORY FUNCTION
function selectCategory(text) {
  let inputField = document.getElementById('addCategoryInputField');
  inputField.innerHTML = text;
}
