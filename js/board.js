async function init() {
  includeHTML();  
  setTimeout(() => {
    showTasks(true);
  }, 500);
  await loadCurrentUsers();
  checkCurrentUser();
  showDropUser();
  document.getElementById("log_out").addEventListener('click', logOut);
  document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);
  window.addEventListener('click', function (event) {
    if (!event.target.matches('.drop-logo')) {
      let dropdowns = document.getElementsByClassName("dropdown-content");
      for (let i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  });
}


//OVERLAY TOP FUNCTION
function openOverlayTop() {
  let overlay = document.getElementById('card_top_overlay');
  if (overlay) {    
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);
  }
}

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

//OVERLAY RIGHT FUNCTION
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
  }
}

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

window.addEventListener('load', function () {
  closeOverlayRight();
});

window.addEventListener('beforeunload', function () {
  closeOverlayRight();
});

function clearBoard(){
  document.getElementById('drag_to_do').innerHTML = '';
  document.getElementById('drag_in_progress').innerHTML = '';
  document.getElementById('drag_await_feedback').innerHTML = '';
  document.getElementById('drag_done').innerHTML = '';
}


//BOARD SWITCH STATUS
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

function setSendTaskStatus(status) {
  sendTaskStatus = status;
}
 
//RENDER TASKS ON BOARD
function renderAllTasks() {
  clearBoard();

  for (let i = 0; i < tasks.length; i++) {    
    switchStatusCase(tasks[i], i);
  }  
  if (document.getElementById('drag_to_do').innerHTML == '') {
    document.getElementById('drag_to_do').innerHTML = `
    <div class="no_task_to_do" draggable="false">
      <span>No Task To Do</span>
    </div>`;
  }
}

async function showTasks(reloadContacts) {
  await loadTasks();
  if (reloadContacts) {
    await initContacts();
  }  
  renderAllTasks();
}


//UPDATE TASK ON BOARD
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


//BUILD OVERLAY TASK CARD
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
  await fillTask(task);
  await toggleContacsDropdown();
  toggleContacsDropdown();
}

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

// DRAG & DROP FUNCTION
document.addEventListener('DOMContentLoaded', (event) => {
  const taskBarContents = document.querySelectorAll('.task_bar_content');
 
  document.addEventListener('dragstart', (event) => {
    if (event.target.classList.contains('task_card')) {
      event.dataTransfer.setData('text/plain', event.target.id);
    }
  });

  taskBarContents.forEach((bar) => {
    bar.addEventListener('dragover', (event) => {
      event.preventDefault();
      bar.style.backgroundColor = '#4589ff';
    });

    bar.addEventListener('dragleave', (event) => {
      bar.style.backgroundColor = '';
    });

    bar.addEventListener('drop', (event) => {
      event.preventDefault();
      const id = event.dataTransfer.getData('text');
      const draggableElement = document.getElementById(id);
      if (draggableElement) {
        bar.appendChild(draggableElement);

        const noTaskElement = bar.querySelector('.no_task_to_do');
        if (noTaskElement) {
          noTaskElement.style.display = 'none';
        }
      }

      let newStatus = '';
      if (bar.id=='drag_to_do') {
        newStatus = 'To do';
      } else if (bar.id=='drag_in_progress') {
        newStatus = 'In progress';
      } else if (bar.id=='drag_await_feedback') {
        newStatus = 'Await feedback';
      } else if (bar.id=='drag_done') {
        newStatus = 'Done';
      }
    
      updateTaskStatus(id, newStatus);

      bar.style.backgroundColor = '';

      taskBarContents.forEach((content) => {
        const noTaskElement = content.querySelector('.no_task_to_do');
        const taskCards = content.querySelectorAll('.task_card');
        if (noTaskElement && taskCards.length === 0) {
          noTaskElement.style.display = 'flex';
        }
      });        
    });
  });

  document.addEventListener('dragend', (event) => {
    if (event.target.classList.contains('task_card')) {
      taskBarContents.forEach((content) => {
        const noTaskElement = content.querySelector('.no_task_to_do');
        const taskCards = content.querySelectorAll('.task_card');
        if (noTaskElement && taskCards.length === 0) {
          noTaskElement.style.display = 'flex';
        }
      });
    }
    setTimeout(() => {
      renderAllTasks();
    }, 50);    
  });
});

//SUBTASK FUNCTIONS
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
      }
    }
  } else {
    for (let i = 0; i< tasks.length; i++) {
      document.getElementById(`${tasks[i].id}`).style.display = 'block';
    }
  }
}
