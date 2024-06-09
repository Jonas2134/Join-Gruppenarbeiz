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

        currentTask.innerHTML += renderTask(tasks[i]);
                
    }
}

function renderTask(task) {
    return `
    <div draggable="true"> ${task.title} </div>
    `;


}

async function showTasks() {
    await loadTasks();
    renderAllTasks();
      }