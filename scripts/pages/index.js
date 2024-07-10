import { addLogoLink } from '../utils/logo.js';
import { fetchDataAndFilterById } from '../utils/dataFetcher.js';


async function getPhotographers() {
    return fetch("data/photographers.json")
        .then(response => response.json());
        
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
    addLogoLink();
}


init();
    
