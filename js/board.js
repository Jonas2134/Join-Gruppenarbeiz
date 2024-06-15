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
        // Überprüfen, ob der Klick nicht auf das Overlay-Inhaltsbereich erfolgt
        if (!overlayContent.contains(event.target)) {
          closeOverlayTop();
        }
      });
    }
  });


  function buildOverlayCard(i) {
   let content = document.getElementById('overlay_top_content');
  let task = tasks[i];
  let title = task['title'];


    content.innerHTML = 
    `
  <div class="overlay_card">

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
      </div>
  
    `;

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


  //OVERLAY RIGHT FUNCTION
function openOverlayRight() {
    let overlay = document.getElementById('add_task_overlay');
    if (overlay) {
      overlay.style.display = 'flex';
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
  

  // DRAG & DROP FUNCTION
document.addEventListener('DOMContentLoaded', (event) => {
    const taskCards = document.querySelectorAll('.task_card');
    const taskBarContents = document.querySelectorAll('.task_bar_content');
  
    taskCards.forEach((card) => {
      card.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', event.target.id);
      });
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
  
    taskCards.forEach((card) => {
      card.addEventListener('dragend', (event) => {
        taskBarContents.forEach((content) => {
          const noTaskElement = content.querySelector('.no_task_to_do');
          const taskCards = content.querySelectorAll('.task_card');
          if (noTaskElement && taskCards.length === 0) {
            noTaskElement.style.display = 'flex';
          }
        });
      });
    });
  });
  
  function renderAllTasks() {
    let currentTask = document.getElementById('drag_to_do');
    for (let i = 0; i < tasks.length; i++) {
        currentTask.innerHTML += renderTask(tasks[i], i);                
    }
}

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

async function showTasks() {
    await loadTasks();
    renderAllTasks();
      }