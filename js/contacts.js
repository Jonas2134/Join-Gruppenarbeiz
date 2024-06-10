let sortedContacts = [];
const colors = ['#fe7b02', '#9228ff', '#6e52ff', '#fc71ff', '#ffbb2b', '#21d7c2', '#462f89', '#ff4646']
const contactColors = {};

async function init() {
    includeHTML();
    await loadContacts();
    renderContacts();
}

function groupContacts() {
    groupedContacts = {};

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groupedContacts[firstLetter]) {
            groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
    }
}

function getInitials(name) {
    const nameParts = name.split(' ');
    return nameParts.map(part => part.charAt(0).toUpperCase()).join('');
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
                let initials = getInitials(contact.name)
                let color = colors[colorIndex % colors.length];
                colorIndex++;
                contactColors[contact.name] = color;
                console.log(contact);
                contactsHtml += `
                <div onclick="openContact(${sortedContacts.length - 1})" class="contact-container d-flex_column">
                    <div>
                        <svg class="contact-container-img" width="100" height="100">
                            <circle cx="50" cy="50" r="25" fill="${color}" />
                            <text x="39" y="56" font-size="1em" fill="#ffffff">${initials}</text>
                        </svg>
                    </div>
                    <div class="contact-container-text d-flex">
                        <div class="contact-container-text-name">${contact.name}</div>
                        <a href="mailto:${contact.email}">${contact.email}</a>
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

/* function editContact(i) {
    let newName = document.getElementById('edit-name').value;
    let newEmail = document.getElementById('edit-email').value;
    let newMobile =  document.getElementById('edit-mobile').value;


    getData(path = []);
} */


/* function deleteContact(i) {
    let contact = contact[i];
    deleteData("/contacts[i]/")
} */