async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute('w3-include-html'); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

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
      }
      bar.style.backgroundColor = '';
    });
  });
});



function openOverlay() {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay) {
      overlay.style.display = 'block';
  } else {
      console.error("Overlay element not found");
  }
}

function closeOverlay() {
  let overlay = document.getElementById('add_task_overlay');
  if (overlay) {
      overlay.style.display = 'none';
  } else {
      console.error("Overlay element not found");
  }
}

window.addEventListener('load', function() {
  closeOverlay();
});

window.addEventListener('beforeunload', function() {
  closeOverlay(); 
});



function toggleDropdown() {
  let content = document.getElementById("categoryDropdown");
  if (content) {
      if (content.classList.contains("show")) {
          content.classList.remove("show");
      } else {
          content.classList.add("show");
      }
  } else {
      console.error("Dropdown content element not found");
  }
}

window.onclick = function(event) {
  if (!event.target.closest('.dropdown_header')) {
      let dropdowns = document.getElementsByClassName("category_to_dropdown_content");
      for (i = 0; i < dropdowns.length; i++) {
          let openDropdown = dropdowns[i];
          if (openDropdown.classList.contains("show")) {
              openDropdown.classList.remove("show");
          }
      }
  }
};