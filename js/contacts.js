let selectedContact = null;
let groupedContacts = groupContacts();

/* START: Hilfsfunktionen */
function docID(id) {
    return document.getElementById(id);
}

function getNewInput() {
    let newName = docID('edit-name').value;
    let newEmail = docID('edit-email').value;
    let newMobile = docID('edit-mobile').value;
    return { name: newName, email: newEmail, mobile: newMobile };
}

function clearAddForm() {
    docID('add-contact-form').reset();
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
/* END: Hilfsfunktionen */

async function init() {
    includeHTML();
    checkFirstPage();
    await initContacts();
    groupContacts();
    renderContacts();
    await loadCurrentUsers();
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

function openContact(i) {
    let selectedContainer = docID('selected-container');

    selectedContainer.innerHTML = generateSelectedContactHTML(i);
    selectedContainer.classList.remove('d-none');

    setTimeout(() => {
        addBlueBackground(i);
    }, 10);
}


function openEditContactOverlay(i) {
    renderEditOverlay(i);
    let editOverlay = docID("overlay_edit-contact");
    editOverlay.classList.remove('d-none');
}

function openAddContactOverlay() {
    let contactOverlay = docID("overlay_add-contact");
    contactOverlay.classList.remove('d-none');
    activateInputError();
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
    let overlay = docID('selected-container');
    
    removeBlueBackground();
    addSelectedSlideAnimation();

    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 2000);
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
    return true
}

async function deleteContact(i) {
    let contactId = contacts[i].id;

    toggleConfirmationOverlay();

    await deleteData(`/contacts/${contactId}`);
    console.log("Contact deleted:", contactId);
    init();
    docID('selected-container').classList.add('d-none');

    closeSelectedContactOverlay();
    showDeletePopup();
}

async function editContact(i) {
    toggleConfirmationOverlay();
    let contactId = contacts[i].id;
    let oldContact = await getData(`/contacts/${contactId}`);
    let newContact = getNewInput();

    changedContact = { ...oldContact, ...newContact };

    await updateData(`/contacts/${contactId}`, changedContact);
    localStorage.setItem('contacts', JSON.stringify(contacts));

    showUpdatePopup();
    closeSelectedContactOverlay();
    closeEditContactOverlay();
    init();
}

async function confirmationEdit(i) {
    let confirmationOverlay = docID('confirmation_overlay');
    let contactId = contacts[i].id;
    let oldContact = await getData(`/contacts/${contactId}`);
    let newContact = getNewInput();

    if (oldContact === newContact) {
        await addErrorAnimation();
        return;
    }

    confirmationOverlay.innerHTML = confirmationEditHTML(i);
    toggleConfirmationOverlay();
}

function confirmationDelete(i) {
    let confirmationOverlay = docID('confirmation_overlay');

    confirmationOverlay.innerHTML = confirmationDeleteHTML(i);
    toggleConfirmationOverlay();
}

function addBlueBackground(i) {
    let contactContainer = docID(`contact-container(${i})`);

    if (selectedContact === contactContainer) {
        contactContainer.classList.remove('blue-background');
        docID('selected-container').classList.remove('show');
        selectedContact = null;
    } else {
        if (selectedContact !== null) {
            selectedContact.classList.remove('blue-background');
        }

        contactContainer.classList.add('blue-background')
        docID('selected-container').classList.add('show');

        selectedContact = contactContainer;
    }
}

function removeBlueBackground() {
    const contactContainer = document.querySelectorAll('.contact-container');

    for (let i = 0; i < contactContainer.length; i++) {
        contactContainer[i].classList.remove('blue-background');
    }
}

function showCreationPopup() {
    docID('creation_popup_container').classList.add('show');
    docID('creation_popup').classList.add('show');
    setTimeout(() => {
        docID('creation_popup_container').classList.remove('show');
    }, 1000);
}

function showUpdatePopup() {
    docID('update_popup_container').classList.add('show');
    docID('update_popup').classList.add('show');
    setTimeout(() => {
        docID('update_popup_container').classList.remove('show');
    }, 1000);
}

function showDeletePopup() {
    docID('delete_popup_container').classList.add('show');
    docID('delete_popup').classList.add('show');
    setTimeout(() => {
        docID('delete_popup_container').classList.remove('show');
    }, 1000);
}

function toggleNav() {
    let navContainer = docID('nav_contact');

    if (navContainer.classList.contains('d-none')) {
        navContainer.classList.remove('d-none');
    } else {
        navContainer.classList.add('d-none');
    }
}

function toggleConfirmationOverlay() {
    let confirmationOverlay = docID('confirmation_overlay');

    if (confirmationOverlay.classList.contains('d-none')) {
        confirmationOverlay.classList.remove('d-none');
        confirmationOverlay.classList.add('d-flex');
    } else {
        confirmationOverlay.classList.remove('d-flex');
        confirmationOverlay.classList.add('d-none');
    }
}

function activateInputError() {
    const fields = [
        { fieldId: 'email', parentId: 'email-contacts' },
        { fieldId: 'name', parentId: 'name-contacts' },
        { fieldId: 'mobile', parentId: 'mobile-contacts' },
        { fieldId: 'edit-name', parentId: 'edit-name-contacts' },
        { fieldId: 'edit-mobile', parentId: 'edit-mobile-contacts' },
        { fieldId: 'edit-email', parentId: 'edit-email-contacts' }
    ];

    fields.forEach(({ fieldId, parentId }) => {
        let field = docID(fieldId);
        let parentDiv = docID(parentId);

        field.addEventListener('invalid', function (event) {
            parentDiv.classList.add('input-error');

            parentDiv.addEventListener('animationend', function () {
                parentDiv.classList.remove('input-error');
            }, { once: true });
        });

        field.addEventListener('input', function (event) {
            parentDiv.classList.remove('input-error');
        });
    });
}

async function addErrorAnimation() {
    const fields = [
        { fieldId: 'edit-name', parentId: 'edit-name-contacts' },
        { fieldId: 'edit-mobile', parentId: 'edit-mobile-contacts' },
        { fieldId: 'edit-email', parentId: 'edit-email-contacts' }
    ];
    fields.forEach(({ parentId }) => {
        let parentDiv = docID(parentId);

        parentDiv.classList.add('input-error');

        parentDiv.addEventListener('animationend', function () {
            parentDiv.classList.remove('input-error');
        }, { once: true });
    })
}

function addSelectedSlideAnimation() {
    let selectedContainer = document.getElementById('selected-container');
    if (selectedContainer.classList.contains('show')) {
        selectedContainer.classList.remove('show');
    } else {
        selectedContainer.classList.add('show');
    }
}