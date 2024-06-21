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

function renderGreeting() {
    const greetingElement = document.getElementById('greetings');
    const greeting = getGreeting();

    if (currentUser.user_name === "Guest User") {
        greetingElement.innerHTML = `${greeting}`;
    } else {
        greetingElement.innerHTML = `${greeting}, <span class="blue_name">${currentUser.user_name}</span>`;
    }
}

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

function countUrgentTasks() {
    let urgentCount = 0;

    tasks.forEach(task => {
        if (task.priority === "Urgent") {
            urgentCount++;
        }
    });

    return urgentCount;
}

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

function renderEarliestDueDate() {
    const earliestUrgentDueDate = getEarliestDueDate();
    const dueDate = document.getElementById('dueDate');

    if (earliestUrgentDueDate) {
        dueDate.innerHTML = earliestUrgentDueDate;
    } else {
        dueDate.innerHTML = 'No urgent tasks';
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();
    await loadCurrentUsers();
    await loadTasks();
    showDropUser();
    renderGreeting();
    renderStatusCount();
    renderEarliestDueDate();

    document.getElementById("log_out").addEventListener('click', logOut)

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
});