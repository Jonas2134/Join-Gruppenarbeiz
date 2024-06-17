//TEMPLATE ADD TASKS
function templateBuildContactDropdown(contact, withCheckbox) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);
  let checkbox = '';
  
  if(withCheckbox) {
    checkbox = `<div>
        <input class="custom_checkbox" type="checkbox" id="cb${contactId}" onclick="event.stopPropagation();">
         </li>
        </div>`;
  } 
  return `
        <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
        ${initials}${contactName}
        </div>
        <div>        
        <label class="cr-wrapper">
        <input id="cb${contactId}" type="checkbox" onclick="event.stopPropagation();"/>
        <div class="cr-input";" onclick="event.stopPropagation();"></div>
        </label>
        </div>
        </li>
        `;
}

function templateBuildContacts(contact) {
  let contactName = contact['name'];
  let initials = templateUserInitials(contact);
  
  return `
        <li class="">
        ${initials}${contactName}
        </li>
        `;
}

function templateUserInitials(contact) {
  return `
  <div style="background-color:${contact.color}" class="contact_container_img">${contact.initials}</div>
  `;
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

//TEMPLATE BOARD
//TEMPLATE BIG BOARD CARD 
function templateBuildOverlayCard(task){
  let categoryClass = getTaskCategoryClass(task.content);
  let setPriority = getPriorityIcon(task.priority);
  let contact = templateBuildOverlayContacts(task.assignedTo);

  let setSubtask = '';
  if (task.subtasks && task.subtasks.length > 0) {
    setSubtask = `
      <div class="overlay_subtasks">
        <span><b class="card_b">Subtasks</b></span>  
        ${templateOverlaySubtasks(task.subtasks)}
      </div>`;
  }

  return `
    <div class="overlay_card">
      <div class="overlay_category">
        <span class="overlay_category_span ${categoryClass}">${task.content}</span>   
        <img src="./icons/add_task_escape_img.png" alt="close"
                class="add_task_escape_img" onclick="closeOverlayTop()">    
      </div>
      <div class="overlay_title">
        <span class="overlay_title_span"><b>${task.title}</b></span>
      </div>
      <div class="overlay_description">
        <span>${task.description}</span>
      </div>
      <div class="overlay_date">
        <div><b class="card_b">Due date:</b></div><div> ${task.dueDate}</div>
      </div>
      <div class="overlay_priority">
        <div><b class="card_b">Priority:</b></div>
        <div class="overlay_priority_status"> ${task.priority}
        <img src="${setPriority}" class="prio_icons"></div>  
      </div>
      <div class="overlay_contacts">
        <span><b class="card_b">Assigned To:</b></span>
        ${contact}
      </div>
      ${setSubtask}
    </div>
    <div class="overlay_icons">
      <img src="/icons/delete_icon.png" alt="delete" class="overlay_card_icon">
      <span class="overlay_icons_span" onclick="deleteTaskById('${task.id}'), closeOverlayTop(), showTasks()">Delete</span>
      <div class="subtask_divider"></div>
      <img src="/icons/edit_icon.png" alt="edit" class="overlay_card_icon">
      <span class="overlay_icons_span">Edit</span>
    </div>`;
}

function templateBuildContactList(contact) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);
  return `
    <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
          ${initials}${contactName}</li>
          `;
}

function getTaskCategoryClass(category) {
  if (category == 'User Story') {
  return 'user_story'
  } else {
    return 'technical';
  }
}

function templateOverlaySubtasks(subtasksArray) {
  let template = '';
  if(subtasksArray) {
    for (let i = 0; i < subtasksArray.length; i++) {
      template += `<p class="overlay_subtask"><input type="checkbox"> ${subtasksArray[i]}</p>`;
    }
  }
  return template;
}


//TEMPLATE SMALL BOARD CARD
function renderTask(task, i) {
let categoryClass = getTaskCategoryClass(task.content);
let setPriority = getPriorityIcon(task.priority);
let contactLogo = templateGetContacts(task.assignedTo);

  return `
    <div draggable="true" id="${task['id']}" class="task_card card_complete" onclick="buildOverlayCard(${i}), openOverlayTop()"> 
      <div class="card_category">
    <span class="card_categories_span ${categoryClass}">${task.content}</span>
      </div>
    <div class="card_top_section">
        <div class="card_title">
    <b>${task.title}</b>
        </div>
      <div class="card_description">
    ${task.description}
      </div>
    </div>
        <div class="card_task_status">
    1/2
        </div>
    <div class="card_bottom_section">    
    ${contactLogo}
    </div>
        <div class="card_prio">
    <img src="${setPriority}" class="prio_icons">
        </div>
      </div>
      </div>
    `;
}

function getPriorityIcon(priority) {
  if(priority == 'Urgent') {
    return 'icons/prio_red.png';
  }
  else if (priority == 'Medium') {
    return 'icons/prio_orange.png';
  }
  else if (priority == 'Low') {
    return 'icons/prio_green.png';
  }
}

function templateGetContacts(contactsArray) {
  let template = '';
  
  if(contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      template += templateUserInitials(getContactById(contactsArray[i]));
    }
  }
  return template;
}

function templateBuildOverlayContacts(contactsArray) {
  let template = '';
  
  if(contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      template += templateBuildContacts(getContactById(contactsArray[i]));

  }
  return template;
}
}