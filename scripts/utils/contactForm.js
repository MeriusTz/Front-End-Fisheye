const modal = document.getElementById("contact_modal"); 
const contentBg = document.querySelector("main"); 
const headerBg = document.querySelector("header");
const modal_form = document.getElementById("contact_form"); 
const photographerNameElement = document.getElementById("photographer-name");

const form_firstName = document.getElementById("firstName");
const form_firstNameError = document.getElementById("firstNameError");
const form_lastName = document.getElementById("lastName"); 
const form_lastNameError = document.getElementById("lastNameError");
const form_email = document.getElementById("email"); 
const form_emailError = document.getElementById("emailError");
const form_message = document.getElementById("message"); 
const form_messageError = document.getElementById("messageError");



// Messages d'erreur pour chaque champ
const messageErrorText = {
	firstName: "Prénom invalide.",
	lastName: "Nom invalide.",
	email: "E-mail invalide.",
	message: "Message invalide."
}; 

// Fonction pour afficher les erreurs
function showError(element, message) {
	element.textContent = message; 
	element.style.display = "block"; 
}

// Fonction pour cacher les erreurs
function hideError(element) {
	if (element) {
		element.style.display = "none"; 
	}
}

// Fonction générique pour vérifier les erreurs
function errorCheck(inputElement, regex, errorElement, errorMessage) {
	const element = inputElement;
	if (!regex.test(inputElement.value) || inputElement.value.trim() === "") {
		element.classList.add("form_error"); 
		showError(errorElement, errorMessage); 
		return false;
	} else {
		element.classList.remove("form_error"); 
		hideError(errorElement);
		return true;
	}
}

// Validation des champs
function validateName(inputElement, errorElement) {
	const nameRegex = RegExp("^[A-Za-zÀ-ÖØ-öø-ÿ]{2,}$");
	return errorCheck(inputElement, nameRegex, errorElement, messageErrorText[inputElement.id]);
}

function validateEmail(inputElement, errorElement) {
	const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-z]{2,4}$");
	return errorCheck(inputElement, emailRegex, errorElement, messageErrorText[inputElement.id]);
}

function validateMessage(inputElement, errorElement) {
	const safeInputRegex = new RegExp("^[^<>;\\/]+$"); 
	return errorCheck(inputElement, safeInputRegex, errorElement, messageErrorText[inputElement.id]);
}

// Ajout des écouteurs d'événements pour la validation en temps réel
form_firstName.addEventListener("input", function () {
	validateName(form_firstName, form_firstNameError); 
});

form_lastName.addEventListener("input", function () {
	validateName(form_lastName, form_lastNameError); 
});

form_email.addEventListener("input", function () {
	validateEmail(form_email, form_emailError); 
});

form_message.addEventListener("input", function () {
	validateMessage(form_message, form_messageError); 
});



// Ajout des écouteurs d'événements pour la soumission du formulaire et la gestion de la modale
document.addEventListener("keydown", handleKeyDown);

modal_form.addEventListener("submit", function (event) {
	event.preventDefault(); // Empêche la soumission du formulaire par défaut
	const isFirstNameValid = validateName(form_firstName, form_firstNameError);
	const isLastNameValid = validateName(form_lastName, form_lastNameError);
	const isEmailValid = validateEmail(form_email, form_emailError);
	const isMessageValid = validateMessage(form_message, form_messageError);

	if (isFirstNameValid && isLastNameValid && isEmailValid && isMessageValid) {

		console.log("Message de", form_firstName.value, form_lastName.value + " (" + form_email.value + ")" + " : ", form_message.value); 
		closeModal(); 
	} else {
		console.log("error");
	}
});
 
// Fonction pour afficher la modale
function displayModal() {
	const photographerName = document.querySelector(".photograph-header h1").textContent;
	photographerNameElement.textContent = photographerName;

	modal.style.display = "block"; 

	modal.setAttribute("aria-hidden", "false"); 
	modal.setAttribute("aria-modal", "true"); 
	modal.setAttribute("aria-label", `Contact me ${photographerName}`);
	contentBg.setAttribute("aria-hidden", "true");
	headerBg.setAttribute("aria-hidden", "true");

	document.body.classList.add("body-no-scroll");

	// Permet à la modale de recevoir le focus
	modal.querySelector(".modal").setAttribute("tabindex", "-1"); 
	modal.querySelector(".modal").focus();

	document.addEventListener("keydown", trapFocus); 
}

// Fonction pour fermer la modale
function closeModal() {
	modal.style.display = "none"; 

	modal.setAttribute("aria-hidden", "true");
	contentBg.setAttribute("aria-hidden", "false"); 
	headerBg.setAttribute("aria-hidden", "false"); 

	document.body.classList.remove("body-no-scroll"); 

}


// Fonction pour piéger le focus à l'intérieur de la modale
function trapFocus(event) {
	const focusableElements = modal.querySelectorAll("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
	const firstElement = focusableElements[0];
	const lastElement = focusableElements[focusableElements.length - 1];

	if (event.key === "Tab") {
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
}

// Fonction pour gérer les événements clavier
function handleKeyDown(event) {
	if (event.keyCode === 27) { // Ferme la modale si la touche Échap est pressée
		closeModal();
	}
}