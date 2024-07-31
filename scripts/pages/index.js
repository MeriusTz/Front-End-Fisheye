import { photographerTemplate } from "../templates/photographer.js";
import { addLogoLink } from "../utils/logo.js";
import { getPhotographersData } from "../utils/dataFetcher.js";

// Fonction pour afficher les données des photographes
async function displayData(photographers) {
	const photographersSection = document.querySelector(".photographer_section");

	photographers.forEach((photographer) => {
		const photographerModel = photographerTemplate(photographer);
		const userCardDOM = photographerModel.getUserCardDOM();
		photographersSection.appendChild(userCardDOM);
	});
}

// Fonction d'initialisation
async function init() {
	// Récupère les données des photographes
	const data = await getPhotographersData();
	displayData(data.photographers); // Affiche les données des photographes
	addLogoLink(); // Ajoute un lien au logo
}



// Appel de la fonction d'initialisation
init(); 