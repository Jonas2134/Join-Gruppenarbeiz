let currentDraggedElement;

async function init() {
  await initCurrentUser();

  setTimeout(() => {
    showTasks(true);
  }, 500);
}

//OVERLAY OPEN BIG TASK CARD
function openOverlayTop() {
  let overlay = document.getElementById('card_top_overlay');
  if (overlay) {    
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);
  }
}

//OVERLAY CLOSE BIG TASK CARD
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

//OVERLAY CLOSE BIG TASK CARD EVENT LISTENER
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

//OVERLAY OPEN ADD TASK ON BOARD
async function openOverlayRight() {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay) {
    document.getElementById('overlay_top_content').innerHTML = '';
    overlay.style.display = 'flex';
    const form = document.getElementById('add_task_overlay_content');
    await fetch('template_add_task.html')
      .then(response => response.text())
      .then(html => { form.innerHTML = html;});
    addTaskContacs();   
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);
    setDateRestriction('taskDueDate');
  }
}

//OVERLAY CLOSE ADD TASK ON BOARD
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

//OVERLAY CLOSE ADD TASK ON BOARD EVENT LISTENER
document.addEventListener('click', function(event) {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay && overlay === event.target) {
    closeOverlayRight();
  }
});

window.addEventListener('load', function () {
  closeOverlayRight();
});

window.addEventListener('beforeunload', function () {
  closeOverlayRight();
});


//CLEAR WHOLE BOARD TO RENDER PROPERLY
function clearBoard(){
  document.getElementById('drag_to_do').innerHTML = '';
  document.getElementById('drag_in_progress').innerHTML = '';
  document.getElementById('drag_await_feedback').innerHTML = '';
  document.getElementById('drag_done').innerHTML = '';
}

//BOARD SWITCH CARD STATUS
function switchStatusCase(task, i) {
  switch(task.status.toLowerCase()) {
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

//SET CARD STATUS
function setSendTaskStatus(status) {
  sendTaskStatus = status;
}
 
//RENDER TASKS ON BOARD
function renderAllTasks() {
  clearBoard();
  for (let i = 0; i < tasks.length; i++) {    
    switchStatusCase(tasks[i], i);
  }  
  renderNoTask();
  setDragEventListeners();
}

//RENDER "NO TASK"-BADGE IF THERE ARE NO TASKS
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

//FUNCTION DRAG & DROP EVENT LISTENER
function setDragEventListeners() {
  const allDragElements = document.querySelectorAll(".task_card");
  allDragElements.forEach((e) => {
    e.addEventListener("touchmove", function (ev) {
      ev.preventDefault();
    });
    e.addEventListener("touchend", function (ev) {
      const touchedTask = ev.changedTouches[0];
      if (insideDiv(touchedTask, "drag_to_do")) {
        moveTo("drag_to_do");
      } else if (insideDiv(touchedTask, "drag_in_progress")) {
        moveTo("drag_in_progress");
      } else if (insideDiv(touchedTask, "drag_await_feedback")) {
        moveTo("drag_await_feedback");
      } else if (insideDiv(touchedTask, "drag_done")) {
        moveTo("drag_done");
      } 
    });
  });
}

//FUNCTION DRAG & DROP WHICH TASK DRAGGED
function insideDiv(touchedTask, id) {
  const element = document.getElementById(id);
  rect = element.getBoundingClientRect();
  return (
    touchedTask.clientX > rect.left &&
    touchedTask.clientX < rect.right &&
    touchedTask.clientY > rect.top &&
    touchedTask.clientY < rect.bottom
  );
}

//RENDER ALL TASK ON BOARD
async function showTasks(reloadContacts) {
  await loadTasks();
  if (reloadContacts) {
    await initContacts();
  }  
  renderAllTasks();
}

//UPDATE TASK STATUS ON BOARD
function updateTaskStatus(id, status) {
  let task = getTaskbyId(id);
  task.status = status;
  updateTaskById(task.id, task);
}

//DELETE TASK ON BOARD 
function deleteTaskOnBoard(id) {
  tasks = deleteById(tasks, id);
  deleteTaskById(id);
  closeOverlayTop();
  renderAllTasks();
}

//BUILD OVERLAY BIG TASK CARD
function buildOverlayCard(i) {
  let content = document.getElementById('overlay_top_content');
  let task = tasks[i];
  content.innerHTML = templateBuildOverlayCard(task);
}

//EDIT OVERLAY TASK CARD
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

//FILLED IN ADD TASK TEMPLATE TO EDIT 
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

//DRAG & DROP - DRAG START 
function startDragging(id) {
  currentDraggedElement = id;
}

//DRAG & DROP - DROP 
function allowDrop(ev) {
    ev.preventDefault();
}

//DRAG & DROP - MOVE TO 
function moveTo(status) {
  updateTaskStatus(currentDraggedElement, getStatusNameByStatusID(status));
  renderAllTasks();  
}

//DRAG & DROP - HIGHLIGHT TASK DIV
function highlight(id) {
  document.getElementById(id).classList.add('task_content-highlight');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('task_content-highlight');
}

//GET STATUS BY ID 
function getStatusNameByStatusID(statusId){
  if (statusId=='drag_to_do') {
    return 'To do';
  } else if (statusId=='drag_in_progress') {
    return 'In progress';
  } else if (statusId=='drag_await_feedback') {
    return 'Await feedback';
  } else if (statusId=='drag_done') {
    return 'Done';
  }
}

//UPDATE FINISHED SUBTASK 
function finishSubtask(subtaskName, id) {
  let task = getTaskbyId(id);
  if (!task.finishedSubtasks) {
    task.finishedSubtasks = [];
    task.finishedSubtasks.push(subtaskName);
  } else if (task.finishedSubtasks.indexOf(subtaskName) > -1){
    task.finishedSubtasks.splice(task.finishedSubtasks.indexOf(subtaskName), 1);
  } else {
    task.finishedSubtasks.push(subtaskName);
  } 
  updateTaskById(id, task);
}

//FILTER FUNCTION 
function filterTask() { 
  let search = document.getElementById('findTask').value.toLowerCase();
  if(search.length >=3) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title.toLowerCase().includes(search) || tasks[i].description.toLowerCase().includes(search)) {
        document.getElementById(`${tasks[i].id}`).style.display = 'block';
      }  else {
        document.getElementById(`${tasks[i].id}`).style.display = 'none';
 }}
  } else {
    for (let i = 0; i< tasks.length; i++) {
      document.getElementById(`${tasks[i].id}`).style.display = 'block';
    }
  }
}
