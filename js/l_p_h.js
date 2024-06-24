document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();
    await loadCurrentUsers();

    const path = window.location.pathname;
    if (path !== '/index.html' && path !== '/signup.html' && path !== '/privacy_policy.html' && path !== '/legal_notice.html') {
        checkCurrentUser();
    } else {
        hideElementsForLoggedOutUsers();
    }
    
    showDropUser();

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