/**
 * Clears the input fields of the 'add contact' form.
 */
function clearAddForm() {
    docID('add-contact-form').reset();
}

/**
 * Activates input error handling for specified fields.
 * Adds 'input-error' class to parent div on invalid input and removes it on valid input.
 * Displays an animation when 'input-error' class is added.
 */
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

/**
 * Displays an error animation on input fields in the edit contact form.
 * Adds 'input-error' class to parent div and removes it after animation ends.
 */
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

/**
 * Adds or removes 'show' class to toggle visibility of selected contact slide animation.
 */
function addSelectedSlideAnimation() {
    let selectedContainer = document.getElementById('selected-container');
    if (selectedContainer.classList.contains('show')) {
        selectedContainer.classList.remove('show');
    } else {
        selectedContainer.classList.add('show');
    }
}

/**
 * Removes the blue background from all contact containers.
 */
function removeBlueBackground() {
    const contactContainer = document.querySelectorAll('.contact-container');

    for (let i = 0; i < contactContainer.length; i++) {
        contactContainer[i].classList.remove('blue-background');
    }
}

/**
 * Opens an overlay to edit a contact.
 * @param {number} i - Index of the contact to be edited.
 */
function openEditContactOverlay(i) {
    renderEditOverlay(i); // Render edit overlay content
    let editOverlay = docID("overlay_edit-contact");
    editOverlay.classList.remove('d-none');
}

/**
 * Opens an overlay to add a new contact.
 * Activates input error handling for the add contact form.
 */
function openAddContactOverlay() {
    let contactOverlay = docID("overlay_add-contact");
    contactOverlay.classList.remove('d-none');
    activateInputError(); // Activate input error handling
}

/**
 * Closes the overlay used to add a new contact.
 * Hides the add contact overlay after a short delay for animation effect.
 */
function closeAddContactOverlay() {
    let overlay = document.getElementById('overlay_add-contact');
    let mainContainer = document.querySelector('.add-contact_main-container');

    // Apply hide animation to main container
    mainContainer.classList.add('hide');

    // Delay closing overlay for animation effect
    setTimeout(function () {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('hide');
    }, 500);
}

/**
 * Closes the overlay used to edit a contact.
 * Hides the edit contact overlay after a short delay for animation effect.
 */
function closeEditContactOverlay() {
    let overlay = document.getElementById('overlay_edit-contact');
    let mainContainer = document.querySelector('.edit-contact_main-container');

    mainContainer.classList.add('hide');

    // Delay closing overlay for animation effect
    setTimeout(function () {
        overlay.classList.add('d-none');
        mainContainer.classList.remove('hide');
    }, 500);
}

/**
 * Closes the overlay displaying selected contact details.
 * Removes blue background and adds slide animation before hiding the overlay.
 */
function closeSelectedContactOverlay() {
    let overlay = docID('selected-container');

    removeBlueBackground();
    addSelectedSlideAnimation();

    // Delay hiding overlay for animation effect
    setTimeout(() => {
        overlay.classList.add('d-none');
    }, 2000);
}
