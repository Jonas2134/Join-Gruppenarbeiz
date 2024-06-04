async function includeHTML() {
    let includeElements = document.querySelectorAll("[w3-include-html]");
    for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      file = element.getAttribute("w3-include-html"); // "includes/header.html"
      let resp = await fetch(file);
      if (resp.ok) {
        element.innerHTML = await resp.text();
      } else {
        element.innerHTML = "Page not found";
      }
    }
  }


  document.addEventListener('DOMContentLoaded', (event) => {
    const taskCards = document.querySelectorAll('.task_card');
    const taskBarContents = document.querySelectorAll('.task_bar_content');

    taskCards.forEach(card => {
        card.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.id);
        });
    });

    taskBarContents.forEach(bar => {
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
  document.getElementById('add_task_overlay').style.display = 'block';
}

function closeOverlay() {
  document.getElementById('add_task_overlay').style.display = 'none';
}

window.addEventListener('load', function() {
  closeOverlay(); // Schließt das Overlay, wenn die Seite geladen wird
});

window.addEventListener('beforeunload', function() {
  closeOverlay(); // Schließt das Overlay, wenn die Seite verlassen wird
});