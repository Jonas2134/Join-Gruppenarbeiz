document.addEventListener("DOMContentLoaded", async function () {
    await includeHTML();

    const path = window.location.pathname;
    let firstPartTriggered = false;

    if (!['/index.html', '/signup.html', '/privacy_policy.html', '/legal_notice.html'].includes(path)) {
        checkFirstPage();
        firstPartTriggered = true;
    } else {
        firstPartTriggered = hideElementsForLoggedOutUsers();
    }

    if (firstPartTriggered === true) {
        await loadCurrentUsers();
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
    }

    document.getElementById("back").addEventListener("click", function () {
        if (document.referrer) {
            window.history.back();
        } else {
            window.location.href = './index.html';
        }
    });

    window.addEventListener('resize', checkOrientation);

    window.addEventListener('orientationchange', checkOrientation);

    checkOrientation();

    setInterval(checkOrientation, 500);
});