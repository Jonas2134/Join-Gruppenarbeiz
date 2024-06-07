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

for (const letter in groupedContacts) {
    if (groupedContacts.hasOwnProperty(letter)) {
        let contactsHtml = '';
        for (let i = 0; i < groupedContacts[letter].length; i++) {
            contactsHtml += `<li>${groupedContacts[letter][i]}</li>`;
        }
        const sectionHtml = `
            <div>
                <h2>${letter}</h2>
                <ul>${contactsHtml}</ul>
            </div>
        `;
        container.innerHTML += sectionHtml;
    }
}


function renderContacts() {
    groupContacts();

    let contactContainer = document.getElementById("contact-container_test");
    contactContainer.innerHTML = '';

    for (const letter in groupedContacts) {
        if (groupedContacts.hasOwnProperty(letter)) {
            let contactHtml = '';
            for (let i = 0; i < groupedContacts[letter].length; i++) {
                const contact = contacts[i];
                console.log(contact);
                contactHtml += `
                <div class="contact-container d-flex_column">
                    <div>
                        <svg class="contact-container-img" width="100" height="100">
                            <circle cx="50" cy="50" r="25" fill="#fe7b02" />
                            <text x="39" y="56" font-size="1em" fill="#ffffff">AB</text>
                        </svg>
                    </div>
                    <div class="contact-container-text d-flex">
                        <div class="contact-container-text-name">${contact.name}</div>
                        <a href="mailto:email@example.com">${contact.email}</a>
                    </div>
                </div>   
                `
            }

            let sectionHtml = '';
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