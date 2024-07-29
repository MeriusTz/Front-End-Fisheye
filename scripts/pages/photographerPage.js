import { PopularityMediaPage, DateMediaPage, TitleMediaPage } from '../templates/photographer.js';
import { fetchDataAndFilterById } from '../utils/dataFetcher.js';
import { addLogoLink } from '../utils/logo.js';
import { printTotalLikes } from '../utils/likes.js';

// Récupère l'ID du photographe à partir de l'URL
const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

// Récupère les données du photographe et les médias associés
fetchDataAndFilterById(id).then(({ photographer, data }) => {
    document.title = `Fisheye - ${photographer.name}`; // Met à jour le titre de la page avec le nom du photographe

    const h2 = document.createElement('h2');
    h2.textContent = photographer.name;
    h2.classList.add('modal_header_name');
    headerModal.insertAdjacentElement('afterend', h2);

    // Initialise la page du photographe
    init();

    async function init() {
        addLogoLink();
        photographerProfile();
        printTotalLikes();
        await mediaSorter('popularite'); // Tri par défaut par popularité
    }

    // Affiche les informations du profil du photographe
    function photographerProfile() {
        const main = document.getElementById('main');

        const photographHeader = document.querySelector('.photograph-header');

        const contactButton = photographHeader.querySelector('.contact_button');

        const picture = `assets/photographers/${photographer.portrait}`;

        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", `Photo de ${photographer.name}`);
        img.classList.add('media');
        photographHeader.appendChild(img);

        const photographInfo = document.createElement('div');

        photographHeader.insertBefore(photographInfo, contactButton);
        
        const createText = (type, content, parent, optionClass) => {
            const balise = document.createElement(type);
            balise.textContent = content;
            parent.appendChild(balise);
            if (optionClass) {
                balise.classList.add(optionClass);
            }
            return balise;
        };
        createText('h1', photographer.name, photographInfo);
        createText('p', `${photographer.city}, ${photographer.country}`, photographInfo, 'location');
        createText('p', photographer.tagline, photographInfo);
    }

    // Fonction pour trier et afficher les médias en fonction de la sélection
    async function mediaSorter(selectedValue) {
        const main = document.getElementById('main');
        let mediaPage;
        if (selectedValue === 'popularite') {
            mediaPage = new PopularityMediaPage(data, id, main, photographer);
        } else if (selectedValue === 'date') {
            mediaPage = new DateMediaPage(data, id, main, photographer);
        } else if (selectedValue === 'titre') {
            mediaPage = new TitleMediaPage(data, id, main, photographer);
        }
        if (mediaPage) {
            await mediaPage.displayPage(); // Affiche la page des médias triés
        }
    }

    // Écouteur d'événement pour le changement de filtre de tri
    document.getElementById('filter').addEventListener('change', async (event) => {
        const selectedValue = event.target.value;
        await mediaSorter(selectedValue);
    });
});

// Gestion des interactions du sélecteur personnalisé
document.addEventListener('DOMContentLoaded', () => {
    const customSelectTrigger = document.querySelector('.custom-select-trigger');
    const customOptions = document.querySelector('.custom-options');
    const customOptionElements = document.querySelectorAll('.custom-option');
    const filterSelect = document.getElementById('filter');
    customSelectTrigger.setAttribute('tabindex', '0');
    customOptionElements.forEach((option) => {
        option.setAttribute('tabindex', '-1');
    });

    // Fonction pour basculer l'affichage des options du sélecteur personnalisé
    function toggleOptions() {
        customOptions.classList.toggle('open');
        customSelectTrigger.classList.toggle('open');
        updateOptionDisplay();
        focusFirstVisibleOption();
    }


    customSelectTrigger.addEventListener('click', (e) => {
        toggleOptions();
    });

    customSelectTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            toggleOptions();
        }
    });

    customOptionElements.forEach((option, index) => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            customOptionElements.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            customSelectTrigger.querySelector('span').textContent = option.textContent;
            customOptions.classList.remove('open');
            customSelectTrigger.classList.remove('open');
            const event = new Event('change');
            filterSelect.value = option.getAttribute('data-value');
            filterSelect.dispatchEvent(event);
            customSelectTrigger.focus();
        });

        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                option.click();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                focusNextVisibleOption(index);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                focusPreviousVisibleOption(index);
            }
        });
    });


    // Ferme les options du sélecteur si le focus est déplacé en dehors
    window.addEventListener('focusin', (e) => {
        if (!customSelectTrigger.contains(e.target) && !customOptions.contains(e.target)) {
            customOptions.classList.remove('open');
            customSelectTrigger.classList.remove('open');
        }
    });

    // Met à jour l'affichage des options pour masquer la sélection actuelle
    function updateOptionDisplay() {
        let lastVisibleOption;
        customOptionElements.forEach(option => {
            if (option.classList.contains('selected')) {
                option.style.display = 'none';
            } else {
                option.style.display = 'block';
                lastVisibleOption = option;
            }
            option.classList.remove('last-visible');
        });
        if (lastVisibleOption) {
            lastVisibleOption.classList.add('last-visible');
        }
    }

    // Applique le focus sur les options    
    function focusFirstVisibleOption() {
        for (const option of customOptionElements) {
            if (option.style.display !== 'none') {
                option.focus();
                break;
            }
        }
    }

    // Navigation du focus
        function focusNextVisibleOption(currentIndex) {
            for (let i = currentIndex + 1; i < customOptionElements.length; i++) {
                if (customOptionElements[i].style.display !== 'none') {
                    customOptionElements[i].focus();
                    break;
                }
            }
        }

        
        function focusPreviousVisibleOption(currentIndex) {
            for (let i = currentIndex - 1; i >= 0; i--) {
                if (customOptionElements[i].style.display !== 'none') {
                    customOptionElements[i].focus();
                    break;
                }
            }
        }
});