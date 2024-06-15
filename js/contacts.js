const colors = ['#fe7b02', '#9228ff', '#6e52ff', '#fc71ff', '#ffbb2b', '#21d7c2', '#462f89', '#ff4646']
const contactColors = {};
let selectedContact = null;
let contactsWithIds = {};

async function init() {
    includeHTML();
    await loadContactsWithIds();
    await loadContacts();
    renderContacts();
    await loadContactsWithIds();
}

function groupContacts() {
    groupedContacts = {};

    for (let i = 0; i < contactsWithIds.length; i++) {
        const contact = contactsWithIds[i];
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);

    }
}

function getInitials(name) {
    const nameParts = name.split(' ');
    initialsObj = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
    return initialsObj
}



function renderContacts() {
    groupContacts();

    let contactsContainer = document.getElementById("contact-filter");
    contactsContainer.innerHTML = '';
    sortedContacts = [];
    colorIndex = 0;

    const sortedLetters = Object.keys(groupedContacts).sort();

    for (const letter of sortedLetters) {
        if (groupedContacts.hasOwnProperty(letter)) {
            let contactsHtml = '';
            for (let i = 0; i < groupedContacts[letter].length; i++) {
                const contact = groupedContacts[letter][i];
                sortedContacts.push(contact);
                const initials = getInitials(contact.name);
                let color = colors[colorIndex % colors.length];
                colorIndex++;
                contactColors[contact.name] = color;
                

                sortedContacts.forEach(item => {
                    item.initials = getInitials(item.name);
                    item.color = contactColors[item.name];
                });

                console.log(contactColors);
                contactsHtml += `
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
                `
            }

            const sectionHtml = `
            <div class="filter-card d-flex">
                <div class="filter-number">${letter}</div>
                <div class="seperator"></div>
                <div id="contact-container">${contactsHtml}</div>
             </div>
            `;
            contactsContainer.innerHTML += sectionHtml;
        }
    }
}

/* 
ToDo: 
- die gewünschte div ID angeben
- auf die "contact_container(${i})" zugreifen um weitere Funktionalität hinzufügen
*/
function getLogo() {
    logoContainer = document.getElementById('profil_logo');
    logoContainer.innerHTML = '';

    for (let i = 0; i < sortedContacts.length; i++) {
        const contact = sortedContacts[i];
        logoContainer.innerHTML += `
            <div id="contact_container(${i})">
                <svg width="100" height="100">
                    <circle cx="50" cy="50" r="25" fill="${contact.color}" />
                    <text x="39" y="56" font-size="1em" fill="#ffffff">${contact.initials}</text>
                </svg>
            </div>
        `;
    }
}
/* END getLogo */

function addContact() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let mobile = document.getElementById('mobile').value;

    let contact = {
        name: name,
        email: email,
        mobile: mobile,
    };

    console.log('contact', contact);
    clearForm();
    postData("/contacts", contact);
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('mobile').value = '';
}

function openAddContactOverlay() {
    let contactOverlay = document.getElementById("overlay_add-contact");
    contactOverlay.classList.remove('d-none');
}

function openEditContactOverlay(i) {
    let editOverlay = document.getElementById("overlay_edit-contact");
    editOverlay.classList.remove('d-none');

    changeProfile(i);
}

function changeProfile(i) {
    let contact = sortedContacts[i];
    let color = contactColors[contact.name];
}

function closeAddContactOverlay() {
    let contactOverlay = document.getElementById("overlay_add-contact");
    contactOverlay.classList.add('d-none');
}

function closeEditContactOverlay() {
    let editOverlay = document.getElementById("overlay_edit-contact");
    editOverlay.classList.add('d-none');
}

function openContact(i) {
    let contact = sortedContacts[i];
    let color = contactColors[contact.name];

    selectContact(i);

    document.getElementById('selected-container').classList.remove('d-none');
    document.getElementById('selected-name').innerHTML = `${sortedContacts[i]['name']}`;
    document.getElementById('selected-mail').innerHTML = `${sortedContacts[i]['email']}`;
    document.getElementById('selected-mobile').innerHTML = `${sortedContacts[i]['mobile']}`;
    /* document.getElementById('selected-img').innerHTML = `${sortedContacts[i]['mobile']}`; */

    document.getElementById('edit').addEventListener('click', function () {
        openEditContactOverlay(i);
    });
    document.getElementById('delete').addEventListener('click', function () {
        deleteContact(i);
    });

    document.getElementById('selected-contact-profil-img').setAttribute('fill', color);
    document.getElementById('edit-contact-profil-img').setAttribute('fill', color);
    document.getElementById('selected-contact-profil-text').innerHTML = `${getInitials(sortedContacts[i]['name'])}`;

    document.getElementById('edit-name').value = `${sortedContacts[i]['name']}`;
    document.getElementById('edit-email').value = `${sortedContacts[i]['email']}`;
    document.getElementById('edit-mobile').value = `${sortedContacts[i]['mobile']}`;


    document.getElementById('edit-button-container').innerHTML = `
        <div onclick="deleteContact(${i})" id="delete" class="delete-button-container d-flex_row">
            <div class="delete-button-text">Delete</div>
        </div>
        <div onclick="editContact(${i});" class="create-button-container d-flex_row">
        <div class="create-button-text">Save</div>
            <div class="create-button-hook">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="black"
                    xmlns="http://www.w3.org/2000/svg">
                    <mask id="mask0_43661_1650" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
                    y="0" width="25" height="25">
                    <rect x="0.5" y="0.98291" width="24" height="24" fill="#D9D9D9" />
                    </mask>
                    <g mask="url(#mask0_43661_1650)">
                        <path
                            d="M10.05 16.1329L18.525 7.65791C18.725 7.45791 18.9625 7.35791 19.2375 7.35791C19.5125 7.35791 19.75 7.45791 19.95 7.65791C20.15 7.85791 20.25 8.09541 20.25 8.37041C20.25 8.64541 20.15 8.88291 19.95 9.08291L10.75 18.2829C10.55 18.4829 10.3167 18.5829 10.05 18.5829C9.78336 18.5829 9.55002 18.4829 9.35002 18.2829L5.05002 13.9829C4.85002 13.7829 4.75419 13.5454 4.76252 13.2704C4.77086 12.9954 4.87502 12.7579 5.07502 12.5579C5.27502 12.3579 5.51252 12.2579 5.78752 12.2579C6.06252 12.2579 6.30002 12.3579 6.50002 12.5579L10.05 16.1329Z"
                            fill="white" />
                    </g>
                </svg>
            </div>
        </div>
    `;
}

function selectContact(i) {
    let contactContainer = document.getElementById(`contact-container(${i})`);

    if (selectedContact !== null) {
        selectedContact.classList.remove('select-contact');
    }
    contactContainer.classList.add('select-contact');
    selectedContact = contactContainer;

/*     document.getElementById('edit').innnerHTML = editHTML(i); */

}

/* function editHTML(i) {
    return `
    <div class="edit-img">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <mask id="mask0_43661_3154" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0"
                                        y="0" width="24" height="24">
                                        <rect width="24" height="24" fill="#D9D9D9" />
                                    </mask>
                                    <g mask="url(#mask0_43661_3154)">
                                        <path
                                            d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
                                            fill="#4589FF" />
                                    </g>
                                </svg>
                            </div>
                            <div class="edit-text">Edit</div>
    `;
} */

async function editContact(i) {
    let contactId = sortedContacts[i].id;
    let contact = await getContact(`/contacts/${contactId}`);
    let getNewInput = getNewInput();

    if (!validateInput(newInput)) {
        console.error("Ungültige Eingabewerte");
        return;
    }

    if (contact.name === newInput.name && contact.email === newInput.email && contact.mobile === newInput.mobile) {
        console.log("Keine Änderungen vorgenommen");
        return;
    }

    contact.name = newInput.name;
    contact.email = newInput.email;
    contact.mobile = newInput.mobile;

    await updateData(`/contacts/${contactId}`, contact);

    console.log("Contact updated:", contact);
}

function getNewInput() {
    let newName = document.getElementById('edit-name').value;
    let newEmail = document.getElementById('edit-email').value;
    let newMobile = document.getElementById('edit-mobile').value;
    return { name: newName, email: newEmail, mobile: newMobile };
}

function validateInput(input) {
    // Einfache Überprüfung, ob die Felder nicht leer sind
    if (!input.name || !input.email || !input.mobile) {
        return false;
    }
    
    // Einfache E-Mail-Formatüberprüfung
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(input.email)) {
        return false;
    }

    // Weitere Überprüfungen können hier hinzugefügt werden, z.B. Telefonnummernformat
    return true;
}


/* function deleteContact(i) {
    let contact = contact[i];

    deleteData("/contacts[i]/")
} */


/* TEST with STORAGE */
async function testData(path = "/contacts/") {
    let response = await fetch(STORAGE_URL + path + ".json");
    let fetchedData = (responseToJson = await response.json());
    console.log("TEST " + fetchedData.name);
    return fetchedData;
}

async function loadContactsWithIds(path = "/contacts/") {
    let response = await fetch(STORAGE_URL + path + ".json");
    let responseAsJson = await response.json();
    console.log("responeAsJson" + responseAsJson);
    let responseWithKeys = Object.keys(responseAsJson).map((key) => {
        return Object.assign({ id: key }, responseAsJson[key]);
    });
    console.log("responseWithKeys" + responseWithKeys)
    contactsWithIds = responseWithKeys;
    return responseWithKeys;
}

async function getContact(path = "") {
    let response = await fetch(STORAGE_URL + path + ".json");
    let resp = await response.json();
    console.log("response", resp);
    return resp;
}