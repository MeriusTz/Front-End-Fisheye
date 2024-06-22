    async function getPhotographers() {
        // Ceci est un exemple de données pour avoir un affichage de photographes de test dès le démarrage du projet, 
        // mais il sera à remplacer avec une requête sur le fichier JSON en utilisant "fetch".
        const reponse = await fetch("data/photographers.json");
        return await reponse.json();
        
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
    }


    // Ajoute un lien vers la page d'accueil sur le logo
    export function addLogoLink() { // Importable dans les autres js
    const logo = document.querySelector(".logo");
    const link = document.createElement('a');

    link.href = '/index.html';
    link.setAttribute('aria-label', "Fisheye Home page");
    logo.parentNode.insertBefore(link, logo);
    link.appendChild(logo);      
    }
    //Mettre le code JavaScript lié à la page index.html
    addLogoLink();

    init();
    
