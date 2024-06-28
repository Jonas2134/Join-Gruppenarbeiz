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
        <div class="contact_div">${initials}${contactName}</div>
        <div>        
        <label class="cr-wrapper">
        <input id="cb${contactId}" type="checkbox"/>
        <div class="cr-input";" onclick="event.stopPropagation();"></div>
        </label>
        </div>
        </li>
        `;
}

//TEMPLATE BUILD CONTACT 
function templateBuildContacts(contact) {
  let contactName = contact['name'];
  let initials = templateUserInitials(contact);
  
  return `
        <li class="">
        ${initials}${contactName}
        </li>
        `;
}

//TEMPLATE BUILD USER INITITALS IN CONTACT LOGO
function templateUserInitials(contact) {
  return `
  <div style="background-color:${contact.color}" class="contact_container_img">${contact.initials}</div>
  `;
}

//TEMPLATE BUILD SUBTASK IN ADD TASK
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
