import { fetchDataAndFilterById } from './dataFetcher.js';

let isLightboxOpen = false;
let currentIndex = 0;
let mediaElements = [];
const lightbox = document.getElementById('lightbox');

const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

// Fonction pour ouvrir la lightbox
export async function openLightbox(photographer, element, index) {
    if (!element) {
        console.error("Element is undefined"); // Affiche une erreur si l'élément est indéfini
        return;
    }

    deleteContent();

    const currentMedia = element.getAttribute("id") === "video" ? document.createElement("video") : document.createElement("img");

    currentMedia.setAttribute("src", element.getAttribute("src"));
    currentMedia.classList.add("lightbox_content");
    if (currentMedia.tagName.toLowerCase() === "video") {
        currentMedia.setAttribute('controls', 'controls'); // Ajoute les contrôles si c'est une vidéo
    }

    const mediaName = element.getAttribute("data-title"); // Récupère le nom du média via le data-title
    const mediaNameElement = document.createElement("p");

    mediaNameElement.textContent = mediaName;
    mediaNameElement.classList.add("lightbox_media_name");
    currentMedia.setAttribute('alt', mediaName); // Définit le texte du nom du média

    lightbox.insertBefore(mediaNameElement, lightbox.firstChild);
    lightbox.insertBefore(currentMedia, lightbox.firstChild);

    lightbox.style.display = "flex"; // Affiche la lightbox
    lightbox.setAttribute("aria-hidden", false);

    // Gestion du focus
    lightbox.setAttribute("tabindex", "0");
    lightbox.focus();

    isLightboxOpen = true;
}

// Fonction pour fermer la lightbox
async function closeLightbox() {
    lightbox.style.display = "none"; // Masque la lightbox
    lightbox.setAttribute("aria-hidden", true); // Indique que la lightbox est cachée
    isLightboxOpen = false;

    lightbox.removeAttribute("tabindex"); // Empêche le focus
}

// Fonction pour supprimer le contenu de la lightbox
async function deleteContent() {
    const mediaContent = document.querySelectorAll('.lightbox_content, .lightbox_media_name');
    mediaContent.forEach(element => element.remove()); // Supprime chaque élément
}

// Fonction pour initialiser la lightbox
export function initializeLightbox(photographer) {
    mediaElements = document.querySelectorAll(".medias");

    mediaElements.forEach((element, index) => {
        element.setAttribute('data-index', index); // Définit un attribut data-index pour chaque élément
        element.addEventListener("click", () => {
            currentIndex = index;
            openLightbox(photographer, element, currentIndex);
        });

        element.addEventListener("keydown", (event) => {
            if (event.key === "Enter" && !isLightboxOpen) {
                currentIndex = index;
                openLightbox(photographer, element, currentIndex); // Ouvre la lightbox avec l'élément sélectionné au clavier
            }
        });
    });
}
 
window.onload = () => {
    if (id) {
        fetchDataAndFilterById(id).then(({ photographer }) => {
            initializeLightbox(photographer); // Initialise la lightbox avec les données du photographe

            async function previousLightbox() {
                if (!isLightboxOpen) return;
                currentIndex = (currentIndex - 1 + mediaElements.length) % mediaElements.length; // Permet d'aller au dernier élément avant le premier
                const currentMedia = mediaElements[currentIndex];
                if (!currentMedia) {
                    return;
                }
                openLightbox(photographer, currentMedia, currentIndex);
            }

            async function nextLightbox() {
                if (!isLightboxOpen) return;
                currentIndex = (currentIndex + 1) % mediaElements.length; // Permet de revenir au premier élément après le dernier
                const currentMedia = mediaElements[currentIndex];
                if (!currentMedia) {
                    return;
                }
                openLightbox(photographer, currentMedia, currentIndex);
            }

            document.addEventListener('keydown', handleKeyDown);
            async function handleKeyDown(event) {
                if (isLightboxOpen) {
                    if (event.key === "ArrowLeft") {
                        previousLightbox();
                    }
                    if (event.key === "ArrowRight") {
                        nextLightbox();
                    }
                    if (event.key === "Escape") {
                        closeLightbox();
                        deleteContent();
                    }
                    if (event.key === "Enter") {
                        event.preventDefault();  // Empêche l'action par défaut de la touche Entrée
                    }
                }
            }

            document.addEventListener('click', function(event) {
                if (event.target.closest('.lightbox_next')) {
                    nextLightbox();
                }
                if (event.target.closest('.lightbox_prev')) {
                    previousLightbox();
                }
                if (event.target.closest('.lightbox_close')) {
                    closeLightbox();
                    deleteContent();
                }
            });

            document.addEventListener('focusin', (event) => {
                if (isLightboxOpen && !lightbox.contains(event.target)) {
                    event.stopPropagation(); // Empêche la propagation de l'événement focusin
                    lightbox.focus(); // Donne le focus à la lightbox
                }
            });
        });

    }
};
