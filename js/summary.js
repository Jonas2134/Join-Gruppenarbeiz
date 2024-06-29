/**
 * Returns a greeting based on the current time of day.
 * 
 * @returns {string} - The appropriate greeting ("Good morning", "Good afternoon", "Good evening", or "Good night").
 */
function getGreeting() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;

    if (hours >= 5 && hours < 12) {
        greeting = "Good morning";
    } else if (hours >= 12 && hours < 17) {
        greeting = "Good afternoon";
    } else if (hours >= 17 && hours < 21) {
        greeting = "Good evening";
    } else {
        greeting = "Good night";
    }
    return greeting;
}

/**
 * Renders the greeting in the HTML element with id 'greetings'.
 * If the current user is a guest, it shows the greeting only.
 * Otherwise, it shows the greeting with the user's name.
 */
function renderGreeting() {
    const greetingElement = document.getElementById('greetings');
    const greeting = getGreeting();

    if (currentUser.user_name === "Guest User") {
        greetingElement.innerHTML = `${greeting}`;
    } else {
        greetingElement.innerHTML = `${greeting}, <span class="blue_name">${currentUser.user_name}</span>`;
    }
}

/**
 * Counts the number of tasks in each status category.
 * 
 * @returns {Object} - An object with the count of tasks in each status ("To do", "In progress", "Await feedback", "Done").
 */
function countStatuses() {
    const statusCount = {
        "To do": 0,
        "In progress": 0,
        "Await feedback": 0,
        "Done": 0
    };

    tasks.forEach(task => {
        if (statusCount.hasOwnProperty(task.status)) {
            statusCount[task.status]++;
        }
    });
    return statusCount;
}

/**
 * Counts the number of tasks with "Urgent" priority.
 * 
 * @returns {number} - The number of urgent tasks.
 */
function countUrgentTasks() {
    let urgentCount = 0;

    tasks.forEach(task => {
        if (task.priority === "Urgent") {
            urgentCount++;
        }
    });
    return urgentCount;
}

/**
 * Renders the count of tasks in different status categories and the number of urgent tasks in the HTML.
 */
function renderStatusCount() {
    const result = countStatuses();
    const urgentTasksCount = countUrgentTasks();

    document.getElementById('urgent').innerHTML = urgentTasksCount;
    document.getElementById('all_Tasks').innerHTML = tasks.length;
    document.getElementById('tasks_todo').innerHTML = result['To do'];
    document.getElementById('tasks_progress').innerHTML = result['In progress'];
    document.getElementById('feedback').innerHTML = result['Await feedback'];
    document.getElementById('tasks_done').innerHTML = result['Done'];
}

/**
 * Finds the earliest due date among urgent tasks that are not done.
 * 
 * @returns {string|null} - The earliest due date in 'YYYY-MM-DD' format, or null if there are no urgent tasks.
 */
function getEarliestDueDate() {
    let earliestDate = null;

    tasks.forEach(task => {
        if (task.priority === "Urgent" && task.status !== "Done") {
            let dueDate = new Date(task.dueDate);
            if (!earliestDate || dueDate < earliestDate) {
                earliestDate = dueDate;
            }
        }
    });
    return earliestDate ? earliestDate.toISOString().split('T')[0] : null;
}

/**
 * Renders the earliest due date of urgent tasks in the HTML element with id 'dueDate'.
 * If there are no urgent tasks, it displays 'No urgent Deadline'.
 */
function renderEarliestDueDate() {
    const earliestUrgentDueDate = getEarliestDueDate();
    const dueDate = document.getElementById('dueDate');

    if (earliestUrgentDueDate) {
        dueDate.innerHTML = earliestUrgentDueDate;
    } else {
        dueDate.innerHTML = 'No urgent Deadline';
    }
}

/**
 * Handles the DOMContentLoaded event. This function includes HTML content, checks the current page, 
 * and sets up event listeners and intervals for various functionalities based on the current page.
 * 
 * @event
 */
document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();
    checkFirstPage();
    await loadCurrentUsers();
    await loadTasks();
    showDropUser();
    renderGreeting();
    renderStatusCount();
    renderEarliestDueDate();

    /**
         * Handles the click event on the logout button, triggering the logOut function.
         * 
         * @event
         */
    document.getElementById("log_out").addEventListener('click', logOut)

    /**
         * Handles the click event on the drop logo, triggering the toggleDropdown function.
         * 
         * @event
         */
    document.querySelector('.drop-logo').addEventListener('click', toggleDropdown);

    /**
     * Handles click events on the window. If the click event's target does not match
     * the element with class 'drop-logo', it will close any open dropdown menus by
     * removing the 'show' class from elements with class 'dropdown-content'.
     * 
     * @event
     * @param {Event} event - The click event.
     */
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

    /**
     * Handles the resize event on the window, triggering the checkOrientation function.
     * 
     * @event
     */
    window.addEventListener('resize', checkOrientation);

    /**
     * Handles the orientationchange event on the window, triggering the checkOrientation function.
     * 
     * @event
     */
    window.addEventListener('orientationchange', checkOrientation);

    checkOrientation();    
    setInterval(checkOrientation, 500);
});