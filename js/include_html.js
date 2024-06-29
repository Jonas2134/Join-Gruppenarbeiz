/**
 * Includes HTML content into elements marked with 'w3-include-html' attribute.
 * Fetches the specified HTML file and inserts its content into the element.
 * If the fetch fails (HTTP status not OK), displays "Page not found" in the element.
 */
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

/**
 * Toggles the visibility of the dropdown menu associated with 'myDropdown' element.
 */
function toggleDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

/**
 * Sets the minimum date of the input field specified by 'id' to today's date.
 * Prevents selection of past dates.
 *
 * @param {string} id - The ID of the date input field to set the restriction on.
 */
function setDateRestriction(id) {
  const today = new Date().toISOString().split('T')[0];
  document.getElementById(id).setAttribute('min', today);
}

/**
 * Initializes the current user session.
 * Includes HTML content, checks the first page, loads current user data,
 * shows the user dropdown, and sets event listeners for logout and dropdown toggle.
 * Hides dropdown menus when clicking outside of the dropdown area.
 */
async function initCurrentUser(){
  includeHTML();
  checkFirstPage();
  await loadCurrentUsers();
  showDropUser();
  document.getElementById("log_out").addEventListener('click', logOut);
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
  window.addEventListener('resize', checkOrientation);
  window.addEventListener('orientationchange', checkOrientation);
  checkOrientation();
  setInterval(checkOrientation, 500);
}