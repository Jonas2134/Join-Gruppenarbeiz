let sortedContacts = [];

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
    

    const sortedLetters = Object.keys(groupedContacts).sort();

    for (const letter of sortedLetters) {
        if (groupedContacts.hasOwnProperty(letter)) {
            let contactsHtml = '';
            for (let i = 0; i < groupedContacts[letter].length; i++) {
                const contact = groupedContacts[letter][i];
                sortedContacts.push(contact);
                let initials = getInitials(contact.name)
                console.log(contact);
                contactsHtml += `
                <div onclick="openContact(${i})" class="contact-container d-flex_column">
                    <div>
                        <svg class="contact-container-img" width="100" height="100">
                            <circle cx="50" cy="50" r="25" fill="#fe7b02" />
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

function closeAddContactOverlay() {
    let contactOverlay = document.getElementById("overlay_add-contact");
    contactOverlay.classList.add('d-none');
}

function closeEditContactOverlay() {
    let contactOverlay = document.getElementById("overlay_edit-contact");
    contactOverlay.classList.add('d-none');
}

function openContact(i) {
    document.getElementById('selected-container').classList.remove('d-none');
    document.getElementById('selected-name').innerHTML = `${sortedContacts[i]['name']}`;
    document.getElementById('selected-mail').innerHTML = `${sortedContacts[i]['email']}`;
    document.getElementById('selected-mobile').innerHTML = `${sortedContacts[i]['mobile']}`;
    /* document.getElementById('selected-img').innerHTML = `${sortedContacts[i]['mobile']}`; */
    document.getElementById('edit').innerHTML = `${sortedContacts[i]['mobile']}`;
    
    document.getElementById('edit').addEventListener('click', function() {
        editContact(i);
    });
    document.getElementById('delete').addEventListener('click', function() {
        deleteContact(i);
    });

}

function editContact(i) {
    getData()
}

function deleteContact(i) {
    let contact = contact[i];
    deleteData("/contacts[i]/")
}