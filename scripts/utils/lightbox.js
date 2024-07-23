import { fetchDataAndFilterById } from './dataFetcher.js';

let isLightboxOpen = false;
let currentIndex = 0;
let mediaElements = [];
const lightbox = document.getElementById('lightbox');

export async function openLightbox(photographer, element, index) {
    if (!element) {
        console.error("Element is undefined");
        return;
    }

    console.log("Opening lightbox with element index:", index);

    deleteContent();

    const currentMedia = element.getAttribute("id") === "video" ? document.createElement("video") : document.createElement("img");

    currentMedia.setAttribute("src", element.getAttribute("src"));
    currentMedia.classList.add("lightbox_content");
    if (currentMedia.tagName.toLowerCase() === "video") {
        currentMedia.setAttribute('controls', 'controls');
    }

    const mediaName = element.getAttribute("alt");
    const mediaNameElement = document.createElement("p");

    mediaNameElement.textContent = mediaName;
    mediaNameElement.classList.add("lightbox_media_name");
    currentMedia.setAttribute('alt', mediaName);

    lightbox.insertBefore(mediaNameElement, lightbox.firstChild);
    lightbox.insertBefore(currentMedia, lightbox.firstChild);

    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", false);

    isLightboxOpen = true;
}

async function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", true);
    isLightboxOpen = false;
}

async function deleteContent() {
    const mediaContent = document.querySelectorAll('.lightbox_content, .lightbox_media_name');
    mediaContent.forEach(element => element.remove());
}

export function initializeLightbox(photographer) {
    mediaElements = document.querySelectorAll(".medias");
    console.log("Media Elements Length: ", mediaElements.length);

    mediaElements.forEach((element, index) => {
        element.setAttribute('data-index', index);
        element.addEventListener("click", () => {
            currentIndex = index;
            console.log("Current Index on click:", currentIndex);
            openLightbox(photographer, element, currentIndex);
        });

        element.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                currentIndex = index;
                console.log("Current Index on keydown:", currentIndex);
                openLightbox(photographer, element, currentIndex);
            }
        });
    });
}

window.onload = () => {
    fetchDataAndFilterById(id).then(({ photographer }) => {
        initializeLightbox(photographer);

        async function previousLightbox() {
            if (!isLightboxOpen) return;
            currentIndex = (currentIndex - 1 + mediaElements.length) % mediaElements.length;
            console.log("Previous Index:", currentIndex);
            const currentMedia = mediaElements[currentIndex];
            if (!currentMedia) {
                console.error("Element is undefined at previousLightbox");
                return;
            }
            openLightbox(photographer, currentMedia, currentIndex);
        }

        async function nextLightbox() {
            if (!isLightboxOpen) return;
            currentIndex = (currentIndex + 1) % mediaElements.length;
            console.log("Next Index:", currentIndex);
            const currentMedia = mediaElements[currentIndex];
            if (!currentMedia) {
                console.error("Element is undefined at nextLightbox");
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
    });

    console.log('Script loaded and executed');
};
