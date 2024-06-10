function renderGreeting() {
    const greetingElement = document.getElementById('good_morning');
    if (currentUser.user_name === "Guest User") {
        greetingElement.textContent = "Good morning";
    } else {
        greetingElement.innerHTML = `Good morning, <span class="blue_name">${currentUser.user_name}</span>`;
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