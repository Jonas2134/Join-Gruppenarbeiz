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