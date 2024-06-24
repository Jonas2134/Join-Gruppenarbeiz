let selectedContact = null;
let groupedContacts = groupContacts();


/* START: Hilfsfunktionen */
function docID(id) {
    return document.getElementById(id);
}
/* END: Hilfsfunktionen */

async function init() {
    includeHTML();
    await initContacts();
    groupContacts();
    renderContacts();

    await loadCurrentUsers();
    checkCurrentUser();
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

function groupContacts() {
    let groupedContacts = {};

    for (let i = 0; i < contacts.length; i++) {
        let contact = contacts[i];
        let firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    }

    return groupedContacts;
}

function renderContacts() {
    let groupedContacts = groupContacts();
    let contactsContainer = docID("contact-filter");
    contactsContainer.innerHTML = '';
    globalIndex = 0;

    let sortedLetters = Object.keys(groupedContacts).sort();
    for (let i = 0; i < sortedLetters.length; i++) {
        let letter = sortedLetters[i];
        let contactsHtml = '';
        let group = groupedContacts[letter];
        for (let j = 0; j < group.length; j++) {
            contactsHtml += createContactHtml(group[j], globalIndex);
            globalIndex++;
        }

        let sectionHtml = createGroupHtml(letter, contactsHtml);
        contactsContainer.innerHTML += sectionHtml;
    }
}

function createContactHtml(contact, index) {
    return `
    <div id="contact-container(${index})" onclick="openContact(${index})" class="contact-container d-flex_column">
        <div style="background-color:${contact.color}" class="contact-container-img">${contact.initials}</div>
        <div class="contact-container-text d-flex">
            <div class="contact-container-text-name">${contact.name}</div>
            <div class="contact-container-mail">${contact.email}</div>
        </div>
    </div>
    `;
}

function createGroupHtml(letter, contactsHtml) {
    return `
    <div class="filter-card d-flex">
        <div class="filter-number">${letter}</div>
        <div class="seperator"></div>
        <div id="contact-container">${contactsHtml}</div>
    </div>
    `;
}

async function addContact(event) {
    event.preventDefault();

    const formData = new FormData(document.getElementById("add-contact-form"));
    const name = formData.get("name");
    const email = formData.get("email");
    const mobile = formData.get("tel");

    let contact = {
        name: name,
        email: email,
        mobile: mobile,
    };

    try {
        await postData("/contacts", contact);
        clearAddForm();
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Kontakts:', error);
    }
    showCreationPopup();
    closeAddContactOverlay();
    init();

    /*     setTimeout(() => {
        window.location.reload();
    }, 2000); */

    return true
}

function showCreationPopup() {
    docID('creation_popup_container').classList.add('show');
    docID('creation_popup').classList.add('show');
    setTimeout(() => {
        docID('creation_popup_container').classList.remove('show');
    }, 2000);
}

function showUpdatePopup() {
    docID('update_popup_container').classList.add('show');
    docID('update_popup').classList.add('show');
    setTimeout(() => {
        docID('update_popup_container').classList.remove('show');
    }, 2000);
}

function showDeletePopup() {
    docID('delete_popup_container').classList.add('show');
    docID('delete_popup').classList.add('show');
    setTimeout(() => {
        docID('delete_popup_container').classList.remove('show');
    }, 2000);
}

function clearAddForm() {
    document.getElementById('add-contact-form').reset();
}

function clearEditForm() {
    document.getElementById('edit-contact-form').reset();
}

function openAddContactOverlay() {
    let contactOverlay = docID("overlay_add-contact");
    contactOverlay.classList.remove('d-none');
    
}

function openEditContactOverlay(i) {
    let editOverlay = docID("overlay_edit-contact");
    editOverlay.classList.remove('d-none');
}

function closeAddContactOverlay() {
    let overlay = document.getElementById('overlay_add-contact');
    let mainContainer = document.querySelector('.add-contact_main-container');

    mainContainer.classList.add('hide');

    setTimeout(function () {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('hide');
    }, 500);
}

function closeEditContactOverlay() {
    let overlay = document.getElementById('overlay_edit-contact');
    let mainContainer = document.querySelector('.edit-contact_main-container');

    mainContainer.classList.add('hide');

    setTimeout(function () {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('hide');
    }, 500);
}

function closeSelectedContactOverlay() {
    let overlay = document.getElementById('selected-container');
    removeBlueBackground();

    addSelectedSlideAnimation();

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 2000);
}

function openContact(i) {
    addBlueBackground(i);

    let selectedContainer = docID('selected-container');
    selectedContainer.innerHTML = `
        <div class="selected-contact-main-container">
            <div class="open-nav-button d-none" onclick="showNav()">
                <div class="add-contact-button-text">Add new contact</div>
                <div class="add-contact-button-img">
                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_45731_2256" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="33" height="32">
                            <rect x="0.21875" width="32" height="32" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_45731_2256)">
                            <path d="M16.2184 26.6666C15.4851 26.6666 14.8573 26.4055 14.3351 25.8833C13.8129 25.361 13.5518 24.7333 13.5518 23.9999C13.5518 23.2666 13.8129 22.6388 14.3351 22.1166C14.8573 21.5944 15.4851 21.3333 16.2184 21.3333C16.9518 21.3333 17.5795 21.5944 18.1018 22.1166C18.624 22.6388 18.8851 23.2666 18.8851 23.9999C18.8851 24.7333 18.624 25.361 18.1018 25.8833C17.5795 26.4055 16.9518 26.6666 16.2184 26.6666ZM16.2184 18.6666C15.4851 18.6666 14.8573 18.4055 14.3351 17.8833C13.8129 17.361 13.5518 16.7333 13.5518 15.9999C13.5518 15.2666 13.8129 14.6388 14.3351 14.1166C14.8573 13.5944 15.4851 13.3333 16.2184 13.3333C16.9518 13.3333 17.5795 13.5944 18.1018 14.1166C18.624 14.6388 18.8851 15.2666 18.8851 15.9999C18.8851 16.7333 18.624 17.361 18.1018 17.8833C17.5795 18.4055 16.9518 18.6666 16.2184 18.6666ZM16.2184 10.6666C15.4851 10.6666 14.8573 10.4055 14.3351 9.88325C13.8129 9.36103 13.5518 8.73325 13.5518 7.99992C13.5518 7.26659 13.8129 6.63881 14.3351 6.11659C14.8573 5.59436 15.4851 5.33325 16.2184 5.33325C16.9518 5.33325 17.5795 5.59436 18.1018 6.11659C18.624 6.63881 18.8851 7.26659 18.8851 7.99992C18.8851 8.73325 18.624 9.36103 18.1018 9.88325C17.5795 10.4055 16.9518 10.6666 16.2184 10.6666Z" fill="white"/>
                        </g>
                    </svg>
                </div>
            </div>
            <div class="nav_contact d-none" id="nav_contact">
                <div class="mobile_nav d-flex_column" id="mobileNav">
                    <div class="edit d-flex row s-gap" onclick="openEditContactOverlay(${i})">
                        <div class="edit-img">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_43661_3154" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_43661_3154)">
                                    <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#4589FF" />
                                </g>
                            </svg>
                        </div>
                        <div class="edit-text">Edit</div>
                    </div>
                    <div class="delete d-flex row s-gap" onclick="deleteContact(${i})">
                        <div class="delete-img">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_43661_2698" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                    <rect width="24" height="24" fill="#D9D9D9" />
                                </mask>
                                <g mask="url(#mask0_43661_2698)">
                                    <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#4589FF" />
                                </g>
                            </svg>
                        </div>
                        <div class="delete-text">Delete</div>
                    </div>
                </div>
            </div>
            <div class="arrow_return_div d-none">
                <div class="arrow-container">
                    <img src="./img/arrow_return.png" alt="go back" class="arrow_return" onclick="closeSelectedContactOverlay()" />
                </div>
            </div>
            <div class="selected-contact-profil-top d-flex row">
                    <div id="selected-img">
                        <div style="background-color:${contacts[i].color}; width:90px; height:90px; font-size:1.6em;" class="contact-container-img selected">${contacts[i].initials}</div>
                    </div>  
                        
                <div class="selected-contact-profil-right d-flex">
                    <div id="selected-name" class="selected-contact-profil-name">${contacts[i].name}</div>
                    <div class="selected-contact-profil-nav d-flex row">
                        <div class="edit d-flex row s-gap" onclick="openEditContactOverlay(${i})">
                            <div class="edit-img">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_43661_3154" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_43661_3154)">
                                        <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" fill="#4589FF" />
                                    </g>
                                </svg>
                            </div>
                            <div class="edit-text">Edit</div>
                        </div>
                        <div class="delete d-flex row s-gap" onclick="deleteContact(${i})">
                            <div class="delete-img">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_43661_2698" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_43661_2698)">
                                        <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.7167 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z" fill="#4589FF" />
                                </g>
                            </svg>
                        </div>
                        <div class="delete-text">Delete</div>
                    </div>
                </div>
            </div>
            </div>
            <div class="selected-contact-profil-bottom d-flex">
                <div class="selected-contact-headline">Contact Information</div>
                <div class="selected-contact-email-container d-flex s-gap">
                    <div class="selected-contact-email-name">Email:</div>
                    <a id="selected-mail" href="mailto:${contacts[i].email}">${contacts[i].email}</a>
                </div>
                <div class="selected-contact-phone-container d-flex s-gap">
                    <div class="selected-contact-phone-name">Phone</div>
                    <a href="${contacts[i].mobile}" id="selected-mobile" class="selected-contact-phone-adress">${contacts[i].mobile}</a>
                </div>
            </div>
        </div>
    `;
    updateEditOverlay(i);
    selectedContainer.classList.remove('d-none');

    setTimeout(() => {
        addSelectedSlideAnimation();
    }, 10); 
}

function updateEditOverlay(i) {
    docID('edit-contact-profile-img').style.backgroundColor = `${contacts[i]['color']}`;
    docID('edit-contact-profile-img').innerHTML = `${contacts[i]['initials']}`;
    
    docID('edit-name').value = `${contacts[i]['name']}`;
    docID('edit-email').value = `${contacts[i]['email']}`;
    docID('edit-mobile').value = `${contacts[i]['mobile']}`;
    docID('edit-button-container').innerHTML = editButtonsHTML(i);
}

function showNav() {
    docID('nav_contact').classList.remove('d-none');
}


function editButtonsHTML(i) {
    return `
    <div onclick="clearEditForm()" id="delete_in_edit" class="blue-button-container d-flex_row">
        <div class="blue-button-text">Delete</div>
    </div>
    <div onclick="editContact(${i})" id="edit_in_edit" class="save-button-container d-flex_row">
        <div class="save-button-text">Save</div>
        <div class="save-button-hook">
            <svg width="25" height="25" viewBox="0 0 25 25" fill="black" xmlns="http://www.w3.org/2000/svg">
                <mask id="mask0_43661_1650" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="25">
                    <rect x="0.5" y="0.98291" width="24" height="24" fill="#D9D9D9" />
                </mask>
                <g mask="url(#mask0_43661_1650)">
                    <path d="M10.05 16.1329L18.525 7.65791C18.725 7.45791 18.9625 7.35791 19.2375 7.35791C19.5125 7.35791 19.75 7.45791 19.95 7.65791C20.15 7.85791 20.25 8.09541 20.25 8.37041C20.25 8.64541 20.15 8.88291 19.95 9.08291L10.75 18.2829C10.55 18.4829 10.3167 18.5829 10.05 18.5829C9.78336 18.5829 9.55002 18.4829 9.35002 18.2829L5.05002 13.9829C4.85002 13.7829 4.75419 13.5454 4.76252 13.2704C4.77086 12.9954 4.87502 12.7579 5.07502 12.5579C5.27502 12.3579 5.51252 12.2579 5.78752 12.2579C6.06252 12.2579 6.30002 12.3579 6.50002 12.5579L10.05 16.1329Z" fill="white" />
                </g>
            </svg>
        </div>
    </div>
    `;
}

function addBlueBackground(i) {
    let contactContainer = docID(`contact-container(${i})`);

    if (selectedContact !== null) {
        selectedContact.classList.remove('blue-background');

    }

    contactContainer.classList.add('blue-background');
    selectedContact = contactContainer;
}

function removeBlueBackground() {
    const contactContainer = document.querySelectorAll('.contact-container');

    for (let i = 0; i < contactContainer.length; i++) {
        contactContainer[i].classList.remove('blue-background');
    }
}

function addSelectedSlideAnimation() {
    let selectedContainer = document.getElementById('selected-container');
    if (selectedContainer.classList.contains('show')) {
        selectedContainer.classList.remove('show');
    } else {
        selectedContainer.classList.add('show');
    }
}

async function editContact(i) {
    let contactId = contacts[i].id;
    let contact = await getData(`/contacts/${contactId}`);

    let newName = docID('edit-name').value;
    let newEmail = docID('edit-email').value;
    let newMobile = docID('edit-mobile').value;

    let confirmationMessage = `
        Sind Sie sicher, dass Sie die folgenden Änderungen durchführen wollen?
        \nName: ${contact.name} zu ${newName}
        \nEmail: ${contact.email} zu ${newEmail}
        \nMobil: ${contact.mobile} zu ${newMobile}
    `;

    if (!validateInput({ name: newName, email: newEmail, mobile: newMobile })) {
        console.error("Ungültige Eingabewerte");
        return;
    }

    if (contact.name === newName && contact.email === newEmail && contact.mobile === newMobile) {
        console.log("Keine Änderungen vorgenommen");
        return;
    }

    if (confirm(confirmationMessage)) {
        contact.name = newName;
        contact.email = newEmail;
        contact.mobile = newMobile;

        await updateData(`/contacts/${contactId}`, contact);

        localStorage.setItem('contacts', JSON.stringify(contacts));
        closeEditContactOverlay();
        console.log("Contact updated:", contact);
        showUpdatePopup();
        closeSelectedContactOverlay();
        init();
/*         setTimeout(() => {
            window.location.reload();
        }, 2000); */
    }
}

function getNewInput() {
    let newName = docID('edit-name').value;
    let newEmail = docID('edit-email').value;
    let newMobile = docID('edit-mobile').value;
    return { name: newName, email: newEmail, mobile: newMobile };
}

function validateInput(input) {
    if (!input.name || !input.email || !input.mobile) {
        return false;
    }
    return true;
}


async function deleteContact(i) {
    const confirmation = confirm("Sind Sie sicher, dass Sie diesen Kontakt löschen möchten?");

    if (confirmation) {
        let contactId = contacts[i].id;
        await deleteData(`/contacts/${contactId}`);
        console.log("Contact deleted:", contactId);
        init();
        docID('selected-container').classList.add('d-none');
    } else {
        console.log("Löschung abgebrochen");
    }

    showDeletePopup();
    
    init();
/*     setTimeout(() => {
        window.location.reload();
    }, 2000); */
}

function showMobileNav() {
    let mobileNav = document.querySelector('.mobile_nav');
    mobileNav.classList.add('show');
}

function hideMobileNav() {
    let mobileNav = document.querySelector('.mobile_nav');
    mobileNav.classList.remove('show');
}

function toggleMobileNav() {
    let mobileNav = document.getElementById('mobileNav');
    if (mobileNav.classList.contains('show')) {
        mobileNav.classList.remove('show');
    } else {
        mobileNav.classList.add('show');
    }
}