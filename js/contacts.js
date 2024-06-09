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
    
    document.getElementById('edit').addEventListener('click', function() {
        openEditContactOverlay(i);
    });
    document.getElementById('delete').addEventListener('click', function() {
        deleteContact(i);
    });

    document.getElementById('selected-contact-profil-img').setAttribute('fill', color);
    document.getElementById('selected-contact-profil-text').innerHTML = `${getInitials(sortedContacts[i]['name'])}`;

}

function editContact(i) {

}


/* function deleteContact(i) {
    let contact = contact[i];
    deleteData("/contacts[i]/")
} */