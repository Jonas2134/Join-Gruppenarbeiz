//TEMPLATE RENDER SPAN IF THERES NO ACTIVE TASK  
function templateNoTask (status) {
  return `<div class="no_task_to_do" draggable="false">
      <span>No Task ${status}</span>
    </div>`;
}

//TEMPLATE RENDER BIG BOARD CARD 
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

//TEMPLATE BUILD CONTACTS 
function templateBuildContactList(contact) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);
  return `
    <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
          ${initials}${contactName}</li>
          `;
}

//GET CATEGORY IN ADD TASK 
function getTaskCategoryClass(category) {
  if (category == 'User Story') {
  return 'user_story'
  } else {
    return 'technical';
  }
}

//TEMPLATE BUILD OVERLAY SUBTASKS
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

//TEMPLATE BUILD SMALL BOARD CARD
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

//GET PRIORITY ICON IN ADD TASK FORM
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

//TEMPLATE BUILD CONTACTS
function templateGetContacts(contactsArray) {
  let template = '';
  if(contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      if (i > 2) {
        let addedContacts = contactsArray.length - 3;
        template += `<span class="added_contacts"> &#43;${addedContacts} </span>`;
        break;
      } else if (getContactById(contactsArray[i])) {
        template += templateUserInitials(getContactById(contactsArray[i]));
      }      
    }
  }
  return template;
}

//BUILD OVERLAY CONTACTS
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