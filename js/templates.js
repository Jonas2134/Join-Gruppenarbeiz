//TEMPLATE ADD TASKS
function templateBuildContactDropdown(contact) {
  let contactName = contact['name'];
  let contactId = contact['id'];
  let initials = templateUserInitials(contact);

  return `
        <li onclick="selectContact('${contactId}')" class="" id="${contactId}">
        ${initials}${contactName}
        </div>
        <div>
        <input class="custom_checkbox" type="checkbox" id="cb${contactId}" onclick="event.stopPropagation();">
        </li>
        </div>
        `;
}

function templateUserInitials(contact) {
  return `
  <div class="svg_contacts_name_div">
    <svg width="36" height="36">
        <circle cx="18" cy="18" r="15" fill="${contact.color}" />
        <text x="8" y="24" font-size="1rem" fill="#ffffff">${contact.initials}</text>
    </svg>
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
  return `<div class="overlay_card">

      <div class="overlay_category">
        <span class="overlay_category_span">${task.content}</span>   
        <img src="./icons/add_task_escape_img.png" alt="close"
                class="add_task_escape_img">    
      </div>
    <div class="overlay_title">
      <span class="overlay_title_span"><b>${task.title}</b></span>
    </div>
      <div class="overlay_description">
        <span>${task.description}</span>
      </div>
    <div class="overlay_date">
      <span><b>Due date:</b>${task.dueDate}</span>
    </div>
      <div class="overlay_priority">
        <span><b>Priority:</b>${task.priority}</span>  
      </div>
    <div class="overlay_contacts">
      <span><b>Assigned To:</b></span>
      <p id="overlayContactsRender">
      ${task.assignedTo}
      </p>
    </div>
      <div class="overlay_subtasks">
        <span><b>Subtasks</b></span>  
        <p><input type="checkbox"> ${task.subtasks}</p>
        <p><input type="checkbox"> ${task.subtasks}</p>
      </div>
  </div>
      <div class="overlay_icons">
  <img src="/icons/delete_icon.png" alt="delete" class="overlay_icon_delete">
    <span>Delete</span>
  <div class="subtask_divider"></div>
  <img src="/icons/edit_icon.png" alt="edit" class="overlay_edit_icon">
    <span>Edit</span>
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

//TEMPLATE SMALL BOARD CARD
function renderTask(task, i) {
  return `
    <div draggable="true" id="${task['ID']}" class="card_complete" onclick="buildOverlayCard(${i}), openOverlayTop()"> 
      <div class="card_category_user_story">
    <span class="card_category_user_story_span">${task.content}</span>
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
      <div class="card_contacts">
    ${task.assignedTo}
      </div>
        <div class="card_prio">
    ${task.priority}
        </div>
    </div>
      </div>
    `;
}