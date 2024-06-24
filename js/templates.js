//TEMPLATE ADD TASKS
function templateBuildContactDropdown(contact, withCheckbox) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);
  let checkbox = '';
  
  if(withCheckbox) {
    checkbox = `<div>
        <input class="custom_checkbox" type="checkbox" id="cb${contactId}">
         </li>
        </div>`;
  } 
  return `
        <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
        ${initials}${contactName}
        </div>
        <div>        
        <label class="cr-wrapper">
        <input id="cb${contactId}" type="checkbox"/>
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
  <img src="./img/edit_icon.png" alt="edit" class="subtask_icon" onclick="editSubtask(${index})">
  <div class="subtask_divider"></div>
  <img src="./img/delete_icon.png" alt="delete" class="subtask_icon" onclick="deleteSubtask(${index}), event.stopPropagation()">
  </div>
  </div>
  <div class="build_subtask_2 inactive" id="subtask_edit_${index}">
  <input class="build_subtask_span_2" value="${subtask}" id="subtask_input_${index}"></input>
  <div class="subtask_icons_div">
  <img src="./img/delete_icon.png" alt="delete" class="subtask_icon_delete" onclick="deleteSubtask(${index}), event.stopPropagation()">
  <div class="subtask_divider"></div>
  <img class="subtask_check_icon" src="./img/check.png" onclick="saveSubtask(${index})">
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
        ${templateOverlaySubtasks(task.subtasks, task.finishedSubtasks, task.id)}
      </div>`;
  }

  return `
    <div class="overlay_card">
      <div class="overlay_category">
        <span class="overlay_category_span ${categoryClass}">${task.content}</span>   
        <img src="./img/add_task_escape_img.png" alt="close"
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
      <img src="./img/delete_icon.png" alt="delete" class="overlay_card_icon">
      <span class="overlay_icons_span" onclick="deleteTaskOnBoard('${task.id}')">Delete</span>
      <div class="subtask_divider"></div>
      <img src="./img/edit_icon.png" alt="edit" class="overlay_card_icon">
      <span class="overlay_icons_span" onclick="editOverlayTask('${task.id}'), event.stopPropagation()">Edit</span>
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

function templateOverlaySubtasks(subtasksArray, finishedArray, id) {
  let template = '';
  if(subtasksArray) {
    for (let i = 0; i < subtasksArray.length; i++) {
      let check = '';
      if (finishedArray && finishedArray.indexOf(subtasksArray[i]) > -1) {
        check='checked';
      }      
      template += `<p class="overlay_subtask"><input type="checkbox" onclick="finishSubtask('${subtasksArray[i]}', '${id}')" ${check}> ${subtasksArray[i]}</p>`;
    }
  }
  return template;
}

//TEMPLATE SMALL BOARD CARD
function renderTask(task, i) {
  let categoryClass = getTaskCategoryClass(task.content);
  let setPriority = getPriorityIcon(task.priority);
  let contactLogo = templateGetContacts(task.assignedTo);

  let progressBarHTML = '';
  if (task.finishedSubtasks && task.subtasks) {
    let percent = Math.round((task.finishedSubtasks.length / task.subtasks.length) * 100);
    progressBarHTML = `
      <div class="progress w3-light-grey w3-round">
        <div class="progress-bar w3-container w3-round w3-blue" style="width: ${percent}%;"></div>              
      </div>
      <span>${task.finishedSubtasks.length}/${task.subtasks.length}</span> 
    `;
  } else if (task.subtasks) {
    progressBarHTML = `
      <div class="progress">
        <div class="progress-bar" style="width: 0%;"></div>        
      </div>
      <span>0/${task.subtasks.length}</span>
    `;
  }
  return `
    <div draggable="true" id="${task.id}" ondragstart="startDragging('${task.id}')" ontouchstart="startDragging('${task.id}')" class="task_card card_complete" onclick="buildOverlayCard(${i}), openOverlayTop()"> 
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
      <div class="progress-div">
    ${progressBarHTML}
      </div>
        </div>
      <div class="overlay_bottom">  
    <div class="card_bottom_section">    
    ${contactLogo}
    </div>
        <div class="card_prio">
    <img src="${setPriority}" class="prio_icons">
        </div>
        </div>
      </div>
      </div>
    `;
}

function getPriorityIcon(priority) {
  if(priority == 'Urgent') {
    return './img/prio_red.png';
  }
  else if (priority == 'Medium') {
    return './img/prio_orange.png';
  }
  else if (priority == 'Low') {
    return './img/prio_green.png';
  }
}

function templateGetContacts(contactsArray) {
  let template = '';
  if(contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      if (getContactById(contactsArray[i])) {
        template += templateUserInitials(getContactById(contactsArray[i]));
      }
    }
  }
  return template;
}

function templateBuildOverlayContacts(contactsArray) {
  let template = '';
  
  if(contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      if (getContactById(contactsArray[i])) {
        template += templateBuildContacts(getContactById(contactsArray[i]));
      }      
    }
  }
  return template;
}

//EDIT OVERLAY TASK
function templateEditOverlayHeader() {
  return `<div class="overlay_top_header" id="overlay_top_header">
  <div class="overlay_edit_return">
    <img src="./img/add_task_escape_img.png" alt="close"
    class="add_task_escape_img" onclick="closeOverlayTop()">
  </div>`;
}

function templateEditOverlayFooter(id) {
  return `<div class="overlay_edit_okay">
  <button class="form_okay_button" onclick="sendTask('${id}'), closeOverlayTop(), showTasks(false);">
    Okay ✔
  </button>
  </div>`;
}