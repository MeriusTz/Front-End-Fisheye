import { photographerTemplate } from '../templates/photographer.js';
import { addLogoLink } from '../utils/logo.js';

// Fonction pour récupérer les données des photographes
async function getPhotographers() {
    return fetch("data/photographers.json")  // Récupère le fichier JSON contenant les données des photographes
        .then(response => response.json());  // Convertit la réponse en JSON
}

// Fonction pour afficher les données des photographes
async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);  // Ajoute chaque photographe à la section
    });
}

// Fonction d'initialisation
async function init() {
    // Récupère les données des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);  // Affiche les données des photographes
    addLogoLink();  // Ajoute un lien au logo
}

// Appel de la fonction d'initialisation
init();