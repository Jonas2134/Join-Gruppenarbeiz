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

document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();
    await loadCurrentUsers();
    showDropUser();
    renderGreeting();

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