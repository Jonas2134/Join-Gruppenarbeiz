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
  } else if (priority == 'medium') {
    mediumPriority.classList.add('priority_active');
    urgentPriority.classList.add('priority_inactive');
    lowPriority.classList.add('priority_inactive');
  } else if (priority == 'low') {
    lowPriority.classList.add('priority_active');
    urgentPriority.classList.add('priority_inactive');
    mediumPriority.classList.add('priority_inactive');
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
    id: null,
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
  let taskAssignedTo = '';
  let taskContentCategory = document.getElementById(
    'addCategoryInputField'
  ).innerHTML;
  let taskSubtask = '';

  task.title = taskTitle;
  task.description = taskDescription;
  task.dueDate = taskDueDate;
  task.priority = taskPriority;
  task.assignedTo = taskAssignedTo;
  task.content = taskContentCategory;
  task.subtasks = taskSubtask;
  // maxID oops
  /* let incMaxId = await getMaxTaskId() + 1;
    let path = '/tasks/' + incMaxId + '/task';
    task.id = incMaxId;
    await postData(path, task);
    await setMaxTaskId(incMaxId); */
  postData('/tasks', task);
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
  clearHtml('addCategoryInputField', `Select task category`);
  clearHtml('subtaskContent', '');


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
        <input class="custom_checkbox" type="checkbox">
        </li>
        `;
}



function selectContact(contactId) {
  let assignedContact = document.getElementById(contactId);
  let index = assignedContacts.indexOf(contactId);

  if (index == -1) {
    assignedContacts.push(contactId);
    assignedContact.classList.add('active');
    
  }  else {
    assignedContacts.splice(assignedContacts.indexOf(contactId), 1);
    assignedContact.classList.remove('active');
  }
    renderAssignedContact();
  }


function renderAssignedContact() {
  let content = document.getElementById('selectedContact');
  content.innerHTML = ''
  for (let i = 0; i < assignedContacts.length; i++) {
    content.innerHTML += `${assignedContacts[i]}`; 
    
  }
  
}


function addSubtask() {
  let subtaskInput = document.getElementById('inputSubtasks');
  let subtask = subtaskInput.value.trim();
  
  if (subtask === "") return; 
  
  let index = subtasks.indexOf(subtask);

  if (index == -1) {
    subtasks.push(subtask);
    renderSubtasks();
  } else {
    subtasks.splice(index, 1); // UNNÖTIG? 
    renderSubtasks();
  }

  clearInput('inputSubtasks');
}


function renderSubtasks() {
  let subtaskContent = document.getElementById('subtaskContent');
  subtaskContent.innerHTML = '';

  subtasks.forEach(subtask => {
    subtaskContent.innerHTML += templateBuildSubtask(subtask);
  });

}



function templateBuildSubtask(subtask) {
  return `
  <div class="build_subtask">
  <li class="build_subtask_span">${subtask}</li>
  <div class="subtask_icons_div">
  <img src="/icons/edit_icon.png" alt="delete" class="subtask_icon">
  <div class="subtask_divider"></div>
  <img src="/icons/delete_icon.png" alt="delete" class="subtask_icon">
  </div>
  </div>
  `;
}



// SELECT CATEGORY FUNCTION
function selectCategory(text) {
  let inputField = document.getElementById('addCategoryInputField');
  inputField.innerHTML = text;
}
