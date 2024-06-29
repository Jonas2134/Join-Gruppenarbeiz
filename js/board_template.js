/**
 * Generates HTML template for displaying a "No Task" message.
 *
 * @param {string} status - The status to be displayed in the message.
 * @returns {string} - The HTML string for the "No Task" message.
 */
function templateNoTask(status) {
  return `<div class="no_task_to_do" draggable="false">
      <span>No Task ${status}</span>
    </div>`;
}

/**
 * Generates HTML template for a detailed overlay card displaying task information.
 *
 * @param {Object} task - The task object containing task details.
 * @param {string} task.content - The content or category of the task.
 * @param {string} task.priority - The priority level of the task.
 * @param {Array} task.assignedTo - The list of contacts assigned to the task.
 * @param {Array} [task.subtasks] - The list of subtasks for the task (optional).
 * @param {Array} [task.finishedSubtasks] - The list of completed subtasks (optional).
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @param {string} task.dueDate - The due date of the task.
 * @returns {string} - The HTML string for the task overlay card.
 */
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

/**
 * Generates HTML template for a contact list item.
 *
 * @param {Object} contact - The contact object containing contact details.
 * @param {string} contact.name - The name of the contact.
 * @param {string} contact.id - The unique identifier of the contact.
 * @returns {string} - The HTML string for the contact list item.
 */
function templateBuildContactList(contact) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);
  return `
    <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
          ${initials}${contactName}</li>
          `;
}

/**
 * Gets the CSS class for the task category.
 *
 * @param {string} category - The category of the task.
 * @returns {string} - The CSS class corresponding to the category.
 */
function getTaskCategoryClass(category) {
  if (category == 'User Story') {
  return 'user_story'
  } else {
    return 'technical';
  }
}

/**
 * Generates HTML template for displaying the subtasks within an overlay.
 *
 * @param {Array} subtasksArray - The array of subtasks.
 * @param {Array} finishedArray - The array of completed subtasks.
 * @param {string} id - The unique identifier of the task.
 * @returns {string} - The HTML string for the subtasks.
 */
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

/**
 * Generates HTML template for a small board task card.
 *
 * @param {Object} task - The task object containing task details.
 * @param {number} i - The index of the task.
 * @param {string} task.content - The content or category of the task.
 * @param {string} task.priority - The priority level of the task.
 * @param {Array} task.assignedTo - The list of contacts assigned to the task.
 * @param {Array} [task.subtasks] - The list of subtasks for the task (optional).
 * @param {Array} [task.finishedSubtasks] - The list of completed subtasks (optional).
 * @param {string} task.id - The unique identifier of the task.
 * @param {string} task.title - The title of the task.
 * @param {string} task.description - The description of the task.
 * @returns {string} - The HTML string for the small board task card.
 */
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
  `;
}

/**
 * Gets the icon URL for the specified priority level.
 *
 * @param {string} priority - The priority level of the task.
 * @returns {string} - The URL of the priority icon.
 */
function getPriorityIcon(priority) {
  if (priority === 'Urgent') {
    return './img/prio_red.png';
  } else if (priority === 'Medium') {
    return './img/prio_orange.png';
  } else if (priority === 'Low') {
    return './img/prio_green.png';
  }
}

/**
 * Generates HTML template for displaying contact initials in a task card.
 *
 * @param {Array} contactsArray - Array of contact IDs assigned to the task.
 * @returns {string} - The HTML string for displaying contact initials.
 */
function templateGetContacts(contactsArray) {
  let template = '';
  if (contactsArray) {
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

/**
 * Generates HTML template for displaying detailed contact information in an overlay.
 *
 * @param {Array} contactsArray - Array of contact IDs assigned to the task.
 * @returns {string} - The HTML string for displaying detailed contact information.
 */
function templateBuildOverlayContacts(contactsArray) {
  let template = '';

  if (contactsArray) {
    for (let i = 0; i < contactsArray.length; i++) {
      if (getContactById(contactsArray[i])) {
        template += templateBuildContacts(getContactById(contactsArray[i]));
      }
    }
  }
  return template;
}

/**
 * Generates HTML template for the header of the edit overlay.
 *
 * @returns {string} - The HTML string for the edit overlay header.
 */
function templateEditOverlayHeader() {
  return `<div class="overlay_top_header" id="overlay_top_header">
    <div class="overlay_edit_return">
      <img src="./img/add_task_escape_img.png" alt="close"
      class="add_task_escape_img" onclick="closeOverlayTop()">
    </div>`;
}

/**
 * Generates HTML template for the footer of the edit overlay.
 *
 * @param {string} id - The unique identifier of the task.
 * @returns {string} - The HTML string for the edit overlay footer.
 */
function templateEditOverlayFooter(id) {
  return `<div class="overlay_edit_okay">
    <button class="form_okay_button" onclick="sendTask('${id}'), closeOverlayTop(), showTasks(false);">
      Okay ✔
    </button>
  </div>`;
}