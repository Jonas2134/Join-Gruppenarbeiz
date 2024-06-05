async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html');
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

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

//OVERLAY RIGHT FUNCTION
function openOverlayRight() {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

function closeOverlayRight() {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

window.addEventListener('load', function () {
  closeOverlayRight();
});

window.addEventListener('beforeunload', function () {
  closeOverlayRight();
});

//OVERLAY TOP FUNCTION
function openOverlayTop() {
  let overlay = document.getElementById('card_top_overlay');
  if (overlay) {
    overlay.style.display = 'flex';
  }
}

function closeOverlayTop() {
  let overlay = document.getElementById('card_top_overlay');
  if (overlay) {
    overlay.style.display = 'none';
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

//TOGGLE DROPDOWN FUNCTION
function toggleDropdown() {
  let content = document.getElementById('categoryDropdown');
  let add_subtasks = document.getElementById('add_subtasks');
  if (content) {
    if (content.classList.contains('show')) {
      content.classList.remove('show');
      add_subtasks.style.marginTop = '0px';
    } else {
      content.classList.add('show');
      let dropdownHeight = content.offsetHeight;
      add_subtasks.style.marginTop = dropdownHeight + 'px';
    }
  }
}

window.onclick = function (event) {
  if (!event.target.closest('.dropdown_header')) {
    let dropdowns = document.getElementsByClassName(
      'category_to_dropdown_content'
    );
    let add_subtasks = document.getElementById('add_subtasks');
    for (i = 0; i < dropdowns.length; i++) {
      let openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    add_subtasks.style.marginTop = '0px';
  }
};

// SELECT CATEGORY FUNCTION
function selectCategory(text) {
  let inputField = document.getElementById('addCategoryInputField');
  inputField.innerHTML = text;
}




//SELECT PRIORITY BUTTON
function selectPriority(priority) {
  let urgentPriority = document.getElementById('urgentPriority');
  let mediumPriority = document.getElementById('mediumPriority');
  let lowPriority = document.getElementById('lowPriority');

  urgentPriority.classList.remove('priority_inactive', 'priority_active');
  mediumPriority.classList.remove('priority_active', 'priority_inactive'); 
  lowPriority.classList.remove('priority_active', 'priority_inactive');  

  if (priority == 'urgent') { 
  urgentPriority.classList.add('priority_active');
  mediumPriority.classList.add('priority_inactive');
  lowPriority.classList.add('priority_inactive');
} else if (priority == 'medium') {

} else if (priority == 'low') {
  
}
}
