
/**
 * Sets up drag and drop event listeners for tasks.
 * 
 * @function setDragEventListeners
 */
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

/**
 * Checks if a touch event is inside a specific div.
 * 
 * @param {Object} touchedTask - The touch event object.
 * @param {string} id - The ID of the div.
 * @returns {boolean} - True if the touch event is inside the div, otherwise false.
 */
function insideDiv(touchedTask, id) {
  const element = document.getElementById(id);
  const rect = element.getBoundingClientRect();
  return (
    touchedTask.clientX > rect.left &&
    touchedTask.clientX < rect.right &&
    touchedTask.clientY > rect.top &&
    touchedTask.clientY < rect.bottom
  );
}

/**
 * Initiates the dragging of a task card.
 * 
 * @param {string} id - The ID of the task being dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
  }
  
  /**
   * Allows an element to be dropped.
   * 
   * @param {Event} ev - The drag event.
   */
  function allowDrop(ev) {
    ev.preventDefault();
  }

  /**
 * Moves a task to a new status.
 * 
 * @param {string} status - The new status of the task.
 */
function moveTo(status) {
    updateTaskStatus(currentDraggedElement, getStatusNameByStatusID(status));
    renderAllTasks();
  }
  
  /**
   * Highlights a task div during drag and drop.
   * 
   * @param {string} id - The ID of the task div.
   */
  function highlight(id) {
    document.getElementById(id).classList.add('task_content-highlight');
  }
  
  /**
   * Removes highlight from a task div.
   * 
   * @param {string} id - The ID of the task div.
   */
  function removeHighlight(id) {
    document.getElementById(id).classList.remove('task_content-highlight');
  }