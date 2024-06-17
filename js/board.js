//OVERLAY TOP FUNCTION
function openOverlayTop() {
  let overlay = document.getElementById('card_top_overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.classList.add('show');
    }, 10);
  }
}

function closeOverlayTop() {
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
      .then(html => {
        form.innerHTML = html;
      });
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

function switchStatusCase(task, i) {
  switch(task.status) {
    case 'To do':
      document.getElementById('drag_to_do').innerHTML += renderTask(task, i);
      break;
    case 'In progress':
      document.getElementById('drag_in_progress').innerHTML += renderTask(task, i);
      break;
    case 'Await feedback':
      document.getElementById('drag_await_feedback').innerHTML += renderTask(task, i);
      break;
    case 'Done':
      document.getElementById('drag_done').innerHTML += renderTask(task, i); 
  }
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

async function showTasks() {
  await loadTasks();
  await initContacts();  
  renderAllTasks();
}


//UPDATE TASK ON BOARD
function updateTaskStatus(id, status) {
  let task = getTaskbyId(id);
  task.status = status;
  updateTaskById(task.id, task);
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
  content.innerHTML = `<div class="overlay_top_header" id="overlay_top_header">`;   
  await fetch('template_add_task.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('overlay_top_header').innerHTML += html;
    });
  content.innerHTML += `</div>`;
  addTaskContacs();  
  fillTask(getTaskbyId(id));
}

function fillTask(task) {
  document.getElementById('taskTitle').value = task.title;
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
      showTasks();
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

//SUCH FUNCTION 
function filterTask() { 
  let search = document.getElementById('findTask').value.toLowerCase();
  if(search.length >=3) {
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].title.toLowerCase().includes(search)) {
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