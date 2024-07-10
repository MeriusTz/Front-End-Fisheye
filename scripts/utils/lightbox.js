import { fetchDataAndFilterById  } from './dataFetcher.js';



async function openLightbox(photographer, element) {
    const currentMedia = element.getAttribute("id") === "video"  ? document.createElement("video") : document.createElement("img");
    
    currentMedia.setAttribute("src", element.getAttribute("src"));
    currentMedia.classList.add("lightbox_content")
    currentMedia.setAttribute('controls', 'controls');

    const mediaName = element.getAttribute("alt");
    const mediaNameElement = document.createElement("p");

    mediaNameElement.textContent = mediaName;
    mediaNameElement.classList.add("lightbox_media_name");
    currentMedia.setAttribute('alt', mediaName);
    
    lightbox.appendChild(currentMedia);
    lightbox.appendChild(mediaNameElement);

    lightbox.style.display = "flex";
    lightbox.setAttribute("aria-hidden", false);

    
}



async function closeLightbox() {
    lightbox.style.display = "none";
    lightbox.setAttribute("aria-hidden", true);
}

async function deleteContent() {
    const children = lightbox.children;
    lightbox.removeChild(children[children.length - 1]);
    lightbox.removeChild(children[children.length - 1]);
}

fetchDataAndFilterById(id).then(photographer => {
    let currentIndex = 0;
    
    document.querySelectorAll(".medias").forEach((element ,index) => {
        element.addEventListener("click", () => {
            currentIndex = index;
            openLightbox(photographer, element);

        });    
    });
    
    function previousLightbox(){
        deleteContent();
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = document.querySelectorAll(".medias").length - 1;
        }
        const currentMedia = document.querySelectorAll(".medias")[currentIndex];
        openLightbox(photographer, currentMedia);
    }

    function nextLightbox(){
        deleteContent();
        currentIndex++;
        if (currentIndex >= document.querySelectorAll(".medias").length) {
            currentIndex = 0;
        }
        const currentMedia = document.querySelectorAll(".medias")[currentIndex];
        openLightbox(photographer, currentMedia);
    }


    
    document.addEventListener('keydown', handleKeyDown);
    function handleKeyDown(event) {
        if (event.key === "ArrowLeft") {
            previousLightbox();
        }
        if (event.key === "ArrowRight") {
            nextLightbox();
        }
        if (event.keyCode === 27) {
            closeLightbox();
            deleteContent();
        }
    }
    
    //Délégation d'événements

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('lightbox_next')) {
            nextLightbox();
        }
        if (event.target.classList.contains('lightbox_prev')) {
            previousLightbox();
        }
        if (event.target.classList.contains('lightbox_close')) {
            closeLightbox();
            deleteContent();
        }
    });

});


