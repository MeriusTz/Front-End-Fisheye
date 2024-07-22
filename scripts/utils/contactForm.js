const modal = document.getElementById("contact_modal");
const modalBtn = document.getElementById("contact_button");
const contentBg = document.querySelector("main");
const headerBg = document.querySelector("header");
const headerModal_title = document.querySelector(".modal-header h2");
const headerModal = document.querySelector(".modal-header");
const modal_container = document.querySelector(".modal");
const modal_form = document.getElementById("contact_form");


const form_firstName = document.getElementById("firstName");
const form_lastName = document.getElementById("lastName");
const form_email = document.getElementById("email");
const form_message = document.getElementById("message");

const messageErrorText = {
    firstName: 'Prénom invalide.', 
    lastName:'Nom invalide.', 
    email:'E-mail invalide.', 
    message:'Message invalide.'
  };

  
  
  
   function showError(element, message) {
      element.textContent = message;
      element.style.display = "block";
    }
    
     function hideError(element) {
        if (element) {
            element.style.display = "none";
        }
    
    }
    
     function errorCheck(inputElement, regex, errorElement, errorMessage) {
        const element = inputElement;
        if(!regex.test(inputElement.value)||inputElement.value.trim() === ""){
            element.classList.add("form_error");
            showError(errorElement, errorMessage);
            return false;
        } else {
            element.classList.remove("form_error");
            hideError(errorElement);
            return true;
        }
    }

function validateName(inputElement, errorElement){
    const nameRegex = RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}$");
    return errorCheck(inputElement, nameRegex, errorElement, messageErrorText[inputElement.id]);
     
}

function validateEmail(inputElement, errorElement){
    const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$");
    return errorCheck(inputElement, emailRegex, errorElement, messageErrorText[inputElement.id]);
}

function validateMessage(inputElement, errorElement){
    const safeInputRegex = new RegExp ("^[^<>;\\/]+$");
    return errorCheck(inputElement, safeInputRegex, errorElement, messageErrorText[inputElement.id]);
}


form_firstName.addEventListener('input', function(event) {
    validateName(form_firstName, firstNameError);
});

form_lastName.addEventListener('input', function(event) {
    validateName(form_lastName, lastNameError);
});

form_email.addEventListener('input', function(event) {
    validateEmail(form_email, emailError);
});

form_message.addEventListener('input', function(event) {
    validateMessage(form_message, messageError);
});

const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

document.addEventListener('keydown', handleKeyDown);



modal_form.addEventListener('submit', function(event) {
    event.preventDefault();
    const isFirstNameValid = validateName(form_firstName, firstNameError);
    const isLastNameValid = validateName(form_lastName, lastNameError);
    const isEmailValid = validateEmail(form_email, emailError);
    const isMessageValid = validateMessage(form_message, messageError);

    if (isFirstNameValid && isLastNameValid && isEmailValid && isMessageValid) {
        const message = {
            "firstName": form_firstName.value,
            "lastName": form_lastName.value,
            "email": form_email.value,
            "message": form_message.value
        };

        console.log('message', message);
        closeModal();
    } else {
        console.log(isFirstNameValid, isLastNameValid, isEmailValid, isMessageValid);
    }
});


function displayModal() {
	modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    contentBg.setAttribute('aria-hidden', 'true');
    headerBg.setAttribute('aria-hidden', 'true');
    document.body.classList.add('body-no-scroll');
    modal_container.setAttribute('tabindex', '-1');
    modal_form.querySelector('input').focus();

document.addEventListener('keydown', function(event) {
    if (event.key === 'Tab' && modal.style.display === 'block') {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (event.shiftKey) {
            if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
});

}

function closeModal() {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    contentBg.setAttribute('aria-hidden', 'false');
    headerBg.setAttribute('aria-hidden', 'false');
    document.body.classList.remove('body-no-scroll');

}
 
function handleKeyDown(event) {
    if (event.keyCode === 27) {
        closeModal();
    }
}
