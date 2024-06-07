function renderContacts() {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        console.log(contact);
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