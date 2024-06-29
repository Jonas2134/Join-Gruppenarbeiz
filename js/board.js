let currentDraggedElement;

/**
 * Initializes the application by setting up the current user and displaying tasks.
 * 
 * @async
 * @function init
 * @returns {Promise<void>}
 */
async function init() {
  await initCurrentUser();

  setTimeout(() => {
    showTasks(true);
  }, 500);  
}

/**
 * Opens the overlay displaying a big task card.
 * 
 * @function openOverlayTop
 */
function openOverlayTop() {
  let overlay = document.getElementById('card_top_overlay');
  if (overlay) {    
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);
  }
}

/**
 * Closes the overlay displaying a big task card.
 * 
 * @function closeOverlayTop
 */
function closeOverlayTop() {
  renderAllTasks();
  let overlay = document.getElementById('card_top_overlay');
  if (overlay) {
    overlay.classList.remove('show');
    overlay.addEventListener('transitionend', function handleTransitionEnd() {
      if (!overlay.classList.contains('show')) {
        overlay.style.display = 'none';
        overlay.removeEventListener('transitionend', handleTransitionEnd);
      }
    });
  }    
}

/**
 * Sets up the event listener to close the big task card overlay when clicking outside its content area.
 * 
 * @function
 * @name EventListener#DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {  
  const cardOverlay = document.getElementById('card_top_overlay');
  const overlayContent = document.getElementById('overlay_top_content');
  if (cardOverlay && overlayContent) {
    cardOverlay.addEventListener('click', (event) => {
      if (!overlayContent.contains(event.target)) {
        closeOverlayTop();
      }
    });
  }  
});

/**
 * Opens the overlay for adding a task to the board.
 * 
 * @async
 * @function openOverlayRight
 * @returns {Promise<void>}
 */
async function openOverlayRight() {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay) {
    document.getElementById('overlay_top_content').innerHTML = '';
    overlay.style.display = 'flex';
    const form = document.getElementById('add_task_overlay_content');
    await fetch('template_add_task.html')
      .then(response => response.text())
      .then(html => { form.innerHTML = html; });
    addTaskContacs();   
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);
    setDateRestriction('taskDueDate');
  }
}

/**
 * Closes the overlay for adding a task to the board.
 * 
 * @function closeOverlayRight
 */
function closeOverlayRight() {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay) {
    overlay.classList.remove('show');
    overlay.addEventListener('transitionend', function handleTransitionEnd() {
      if (!overlay.classList.contains('show')) {
        overlay.style.display = 'none';
        overlay.removeEventListener('transitionend', handleTransitionEnd);
      }
    });
  }
}

/**
 * Sets up the event listener to close the add task overlay when clicking outside it.
 * 
 * @function
 * @name EventListener#click
 */
document.addEventListener('click', function(event) {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay && overlay === event.target) {
    closeOverlayRight();
  }
});

/**
 * Closes the add task overlay when the window loads.
 * 
 * @function
 * @name EventListener#load
 */
window.addEventListener('load', function () {
  closeOverlayRight();
});

/**
 * Closes the add task overlay before the window unloads.
 * 
 * @function
 * @name EventListener#beforeunload
 */
window.addEventListener('beforeunload', function () {
  closeOverlayRight();
});

/**
 * Clears all task columns on the board.
 * 
 * @function clearBoard
 */
function clearBoard() {
  document.getElementById('drag_to_do').innerHTML = '';
  document.getElementById('drag_in_progress').innerHTML = '';
  document.getElementById('drag_await_feedback').innerHTML = '';
  document.getElementById('drag_done').innerHTML = '';
}

/**
 * Switches the status of a task and renders it in the appropriate column on the board.
 * 
 * @param {Object} task - The task object.
 * @param {number} i - The index of the task.
 */
function switchStatusCase(task, i) {
  switch (task.status.toLowerCase()) {
    case 'to do':
      document.getElementById('drag_to_do').innerHTML += renderTask(task, i);
      break;
    case 'in progress':
      document.getElementById('drag_in_progress').innerHTML += renderTask(task, i);
      break;
    case 'await feedback':
      document.getElementById('drag_await_feedback').innerHTML += renderTask(task, i);
      break;
    case 'done':
      document.getElementById('drag_done').innerHTML += renderTask(task, i);
  }
}

/**
 * Sets the status for sending a task.
 * 
 * @param {string} status - The status to be set.
 */
function setSendTaskStatus(status) {
  sendTaskStatus = status;
}

/**
 * Renders all tasks on the board.
 * 
 * @function renderAllTasks
 */
function renderAllTasks() {
  clearBoard();
  for (let i = 0; i < tasks.length; i++) {    
    switchStatusCase(tasks[i], i);
  }  
  renderNoTask();
  setDragEventListeners();
}

/**
 * Renders a "No Task" badge if there are no tasks in a column.
 * 
 * @function renderNoTask
 */
function renderNoTask() {
  if (document.getElementById('drag_to_do').innerHTML == '') {
    document.getElementById('drag_to_do').innerHTML = templateNoTask('To do');
  }
  if (document.getElementById('drag_in_progress').innerHTML == '') {
    document.getElementById('drag_in_progress').innerHTML = templateNoTask('In progress');
  }
  if (document.getElementById('drag_await_feedback').innerHTML == '' ) {
    document.getElementById('drag_await_feedback').innerHTML = templateNoTask('Awaiting feedback');
  }
  if (document.getElementById('drag_done').innerHTML == '' ) {
    document.getElementById('drag_done').innerHTML = templateNoTask('Done');
  }
}

/**
 * Loads tasks and renders them on the board.
 * 
 * @async
 * @function showTasks
 * @param {boolean} reloadContacts - Whether to reload contacts.
 * @returns {Promise<void>}
 */
async function showTasks(reloadContacts) {
  await loadTasks();
  if (reloadContacts) {
    await initContacts();
  }  
  renderAllTasks();
}

/**
 * Updates the status of a task on the board.
 * 
 * @function updateTaskStatus
 * @param {string} id - The ID of the task.
 * @param {string} status - The new status of the task.
 */
function updateTaskStatus(id, status) {
  let task = getTaskbyId(id);
  task.status = status;
  updateTaskById(task.id, task);
}

/**
 * Deletes a task from the board.
 * 
 * @function deleteTaskOnBoard
 * @param {string} id - The ID of the task.
 */
function deleteTaskOnBoard(id) {
  tasks = deleteById(tasks, id);
  deleteTaskById(id);
  closeOverlayTop();
  renderAllTasks();
}

/**
 * Builds and displays the overlay for a big task card.
 * 
 * @function buildOverlayCard
 * @param {number} i - The index of the task.
 */
function buildOverlayCard(i) {
  let content = document.getElementById('overlay_top_content');
  let task = tasks[i];
  content.innerHTML = templateBuildOverlayCard(task);
}

/**
 * Edits a task in the overlay.
 * 
 * @async
 * @function editOverlayTask
 * @param {string} id - The ID of the task.
 * @returns {Promise<void>}
 */
async function editOverlayTask(id) {
  document.getElementById('add_task_overlay_content').innerHTML = '';
  const content = document.getElementById('overlay_top_content');
  content.innerHTML = templateEditOverlayHeader();

  await fetch('template_add_task.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('overlay_top_header').innerHTML += html;
    });
  let task = getTaskbyId(id);
  content.innerHTML += templateEditOverlayFooter(id);
  await addTaskContacs();  
  fillTask(task);
  setDateRestriction('taskDueDate');
}

/**
 * Fills the add task template with existing task data for editing.
 * 
 * @param {Object} task - The task object.
 */
function fillTask(task) {
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description;
  document.getElementById('taskDueDate').value = task.dueDate;
  selectPriority(task.priority);
  assignedContacts = [];
  for (let i = 0; i < task.assignedTo.length; i++) {
    selectContact(task.assignedTo[i]);
  }
  document.getElementById('addCategoryInputField').innerHTML = task.content;
  subtasks = [];
  for (let i = 0; i < task.subtasks.length; i++) {
    subtasks.push(task.subtasks[i]);
  }
  renderSubtasks();
}

/**
 * Gets the status name based on the status ID.
 * 
 * @param {string} statusId - The status ID.
 * @returns {string} - The status name.
 */
function getStatusNameByStatusID(statusId) {
  if (statusId == 'drag_to_do') {
    return 'To do';
  } else if (statusId == 'drag_in_progress') {
    return 'In progress';
  } else if (statusId == 'drag_await_feedback') {
    return 'Await feedback';
  } else if (statusId == 'drag_done') {
    return 'Done';
  }
}

/**
 * Updates the status of a subtask as finished or unfinished.
 * 
 * @param {string} subtaskName - The name of the subtask.
 * @param {string} id - The ID of the task.
 */
function finishSubtask(subtaskName, id) {
  let task = getTaskbyId(id);
  if (!task.finishedSubtasks) {
    task.finishedSubtasks = [];
    task.finishedSubtasks.push(subtaskName);
  } else if (task.finishedSubtasks.indexOf(subtaskName) > -1) {
    task.finishedSubtasks.splice(task.finishedSubtasks.indexOf(subtaskName), 1);
  } else {
    task.finishedSubtasks.push(subtaskName);
  }
  updateTaskById(id, task);
}

/**
 * Filters tasks based on the search input.
 * 
 * @function filterTask
 */
function filterTask() {
  let search = document.getElementById('findTask').value.toLowerCase();
  if (search.length >= 3) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title.toLowerCase().includes(search) || tasks[i].description.toLowerCase().includes(search)) {
        document.getElementById(`${tasks[i].id}`).style.display = 'block';
      } else {
        document.getElementById(`${tasks[i].id}`).style.display = 'none';
      }
    }
  } else {
    for (let i = 0; i < tasks.length; i++) {
      document.getElementById(`${tasks[i].id}`).style.display = 'block';
    }
  }
}
