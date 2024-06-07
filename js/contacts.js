function renderContacts() {
    let contactContainer = document.getElementById("loaded-filter-card");
    contactContainer.innerHTML = '';

    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        console.log(contact);
        contactContainer.innerHTML += `
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
        `
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