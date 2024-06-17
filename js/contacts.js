/* const colors = ['#fe7b02', '#9228ff', '#6e52ff', '#fc71ff', '#ffbb2b', '#21d7c2', '#462f89', '#ff4646'] */
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
        <div>
            <svg class="contact-container-img" width="100" height="100">
                <circle cx="50" cy="50" r="25" fill="${contact.color}" />
                <text x="39" y="56" font-size="1em" fill="#ffffff">${contact.initials}</text>
            </svg>
        </div>
        <div class="contact-container-text d-flex">
            <div class="contact-container-text-name">${contact.name}</div>
            <a class="contact-container-mail" href="mailto:${contact.email}">${contact.email}</a>
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

/* function renderContacts() {
    let contactsContainer = docID("contact-filter");
    contactsContainer.innerHTML = '';
    contacts = [];
    colorIndex = 0;

    const sortedLetters = Object.keys(groupedContacts).sort();

    for (const letter of sortedLetters) {
        let contactsHtml = groupedContacts[letter].map((contact, index) => {
            sortedContacts.push(contact);
            const initials = getInitials(contact.name);
            let color = colors[colorIndex % colors.length];
            colorIndex++;
            contactColors[contact.name] = color;

            return `
            <div id="contact-container(${sortedContacts.length - 1})" onclick="openContact(${sortedContacts.length - 1})" class="contact-container d-flex_column">
                <div>
                    <svg class="contact-container-img" width="100" height="100">
                        <circle cx="50" cy="50" r="25" fill="${color}" />
                        <text x="39" y="56" font-size="1em" fill="#ffffff">${initials}</text>
                    </svg>
                </div>
                <div class="contact-container-text d-flex">
                    <div class="contact-container-text-name">${contact.name}</div>
                    <a class="contact-container-mail" href="mailto:${contact.email}">${contact.email}</a>
                </div>
            </div>
            `;
        }).join('');

        const sectionHtml = `
        <div class="filter-card d-flex">
            <div class="filter-number">${letter}</div>
            <div class="seperator"></div>
            <div id="contact-container">${contactsHtml}</div>
        </div>
        `;
        contactsContainer.innerHTML += sectionHtml;
    }
} */

/* 
ToDo: 
- die gewünschte div ID angeben
*/
function renderLogo() {
    logoContainer = docID('profil_logo');
    logoContainer.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        logoContainer.innerHTML += `
            <div id=profil_logo_container${i}>
                <svg width="100" height="100">
                    <circle cx="50" cy="50" r="25" fill="${contact.color}" />
                    <text x="39" y="56" font-size="1em" fill="#ffffff">${contact.initials}</text>
                </svg>
            </div>
        `;
    }
}
/* END getLogo */

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
        clearForm();
        showPopup();
    } catch (error) {
        console.error('Fehler beim Hinzufügen des Kontakts:', error);
    }

    init();
    return true
}



function showPopup() {
    docID('popup_container').classList.add('show');
    docID('popup').classList.add('show');
    /* d-none soll erst nach der animationsdauer eingefügt werden */
    setTimeout(() => {
        docID('popup').classList.add('d-none');
        docID('popup_container').classList.remove('show');
    }, 2000);
}

function clearForm() {
    document.getElementById('add-contact-form').reset();
}

function openAddContactOverlay() {
    let contactOverlay = docID("overlay_add-contact");
    contactOverlay.classList.remove('d-none');
}

function openEditContactOverlay(i) {
    let editOverlay = docID("overlay_edit-contact");
    editOverlay.classList.remove('d-none');

    changeProfile(i);
}

function changeProfile(i) {
    let contact = contacts[i];
    let color = contacts[i].color;
}

function closeAddContactOverlay() {
    let contactOverlay = docID("overlay_add-contact");
    contactOverlay.classList.add('d-none');
}

function closeEditContactOverlay() {
    let editOverlay = docID("overlay_edit-contact");
    editOverlay.classList.add('d-none');
}

function openContact(i) {
    let contact = contacts[i];
    let color = contact.color;

    addBlueBackground(i);

    docID('selected-container').classList.remove('d-none');
    docID('selected-name').innerHTML = `${contacts[i]['name']}`;
    docID('selected-mail').innerHTML = `${contacts[i]['email']}`;
    docID('selected-mobile').innerHTML = `${contacts[i]['mobile']}`;

    // Reset Event Listeners
    let editButton = docID('edit').cloneNode(true);
    let deleteButton = docID('delete').cloneNode(true);

    // Replace old buttons with cloned nodes to remove old listeners
    docID('edit').replaceWith(editButton);
    docID('delete').replaceWith(deleteButton);

    // Add new event listeners
    editButton.addEventListener('click', editContactHandler.bind(null, i));
    deleteButton.addEventListener('click', deleteContactHandler.bind(null, i));

    docID('selected-contact-profil-img').setAttribute('fill', color);
    docID('selected-contact-profil-text').innerHTML = `${getInitials(contacts[i]['name'])}`;

    docID('edit-contact-profil-img').setAttribute('fill', color);

    docID('edit-name').value = `${contacts[i]['name']}`;
    docID('edit-email').value = `${contacts[i]['email']}`;
    docID('edit-mobile').value = `${contacts[i]['mobile']}`;

    docID('edit-button-container').innerHTML = editButtonHTML(i);
}

function editButtonHTML(i) {
    return `
    <div id="delete_in_edit" class="blue-button-container d-flex_row">
        <div class="blue-button-text">Delete</div>
    </div>
    <div id="edit_in_edit" class="create-button-container d-flex_row">
        <div class="create-button-text">Save</div>
        <div class="create-button-hook">
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

function deleteContactHandler(index) {
    deleteContact(index);
}

function editContactHandler(index) {
    openEditContactOverlay(index);
}


function deleteContactHandler(index) {
    deleteContact(index);
}

function editContactHandler(index) {
    openEditContactOverlay(index);
}


function addBlueBackground(i) {
    let contactContainer = docID(`contact-container(${i})`);

    if (selectedContact !== null) {
        selectedContact.classList.remove('blue-background');
    }
    contactContainer.classList.add('blue-background');
    selectedContact = contactContainer;
}

async function editContact(i) {
    let contactId = contacts[i].id;
    let contact = await getData(`/contacts/${contactId}`);
    let newInput = getNewInput();

    if (!validateInput(newInput)) {
        console.error("Ungültige Eingabewerte"); /* das sollte in einer Form überprüft werden */
        return;
    }

    if (contact.name === newInput.name && contact.email === newInput.email && contact.mobile === newInput.mobile) {
        console.log("Keine Änderungen vorgenommen"); /* das sollte in einer Form überprüft werden */
        return;
    }

    contact.name = newInput.name;
    contact.email = newInput.email;
    contact.mobile = newInput.mobile;

    await updateData(`/contacts/${contactId}`, contact);

    console.log("Contact updated:", contact);
    init();
}

function getNewInput() {
    let newName = docID('edit-name').value;
    let newEmail = docID('edit-email').value;
    let newMobile = docID('edit-mobile').value;
    return { name: newName, email: newEmail, mobile: newMobile };
}

function validateInput(input) {
    // Einfache Überprüfung, ob die Felder nicht leer sind
    if (!input.name || !input.email || !input.mobile) {
        return false;
    }

    // Weitere Überprüfungen können hier hinzugefügt werden, z.B. Telefonnummernformat
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
}