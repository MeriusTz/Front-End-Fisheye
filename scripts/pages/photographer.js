import { createPicture, createText, createMediaElement } from '../templates/mediasPage.js';
import { mediaFactory  } from '../utils/mediaFactory.js';
import { addLikes, printTotalLikes } from '../utils/likes.js';
import { fetchDataAndFilterById } from '../utils/dataFetcher.js';
import { addLogoLink } from '../utils/logo.js';
import { openLightbox } from '../utils/lightbox.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");



fetchDataAndFilterById(id).then(({ photographer, data }) => {


    //Nom dans la modale
    const h2 = document.createElement('h2');
    h2.textContent = photographer.name;
    h2.classList.add('modal_header_name');
    headerModal.insertAdjacentElement('afterend', h2);



    init();

    async function init() {
        let selectedValue = 'popularite';
        let sortedMedia = sortMedia(selectedValue);
        addLogoLink();
        photographerProfile();

        printTotalLikes();
        mediaSorter();
        printMedias(sortedMedia);
    }


function photographerProfile() {
    
    const main = document.getElementById('main');
    const photographHeader = document.querySelector('.photograph-header');
    const contactButton = photographHeader.querySelector('.contact_button');
    const picture = `assets/photographers/${photographer.portrait}`;

    createPicture(picture, `Photo de ${photographer.name}`, photographHeader);
    
    const photographInfo = document.createElement('div');
    // Insérer photographInfo avant le bouton de contact
    photographHeader.insertBefore(photographInfo, contactButton);

    createText('h2', photographer.name, photographInfo);
    createText('p', `${photographer.city}, ${photographer.country}`, photographInfo, 'location');
    createText('p', photographer.tagline, photographInfo);
}



// Fonction pour trier les médias en fonction de l'option sélectionnée
function sortMedia(selectedValue) {
    let sortedMedia = [];
    if (selectedValue === 'popularite') {
        sortedMedia = data.media.filter(m => m.photographerId == id).sort((a, b) => b.likes - a.likes);
    } else if (selectedValue === 'date') {
        sortedMedia = data.media.filter(m => m.photographerId == id).sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (selectedValue === 'titre') {
        sortedMedia = data.media.filter(m => m.photographerId == id).sort((a, b) => a.title.localeCompare(b.title));
    }

    
    return sortedMedia;
}





async function mediaSorter() {

const filterSelect = document.getElementById('filter');

filterSelect.addEventListener('change', async () => {
    const selectedValue = filterSelect.value;
    const sortedMedia = sortMedia(selectedValue);

    // Supprimer les éléments déjà présents
    const mediaSection = document.querySelector('.media_section');
    mediaSection.remove();

    await printMedias(sortedMedia);
    console.log('Médias triés selon', selectedValue, ':', sortedMedia);



});

}


async function printMedias(sortedMedia){
    let medias = document.createElement('section');
    medias.classList.add('media_section');

    
    let totalLikesValue = 0;

    sortedMedia.forEach(m => {
        
        const mediaData = mediaFactory(m);

        const articleMedia = document.createElement('article');
        articleMedia.classList.add('media_article');

        main.appendChild(articleMedia);
        

        if(mediaData.type === 'video') {
            const mediaElement = createMediaElement(mediaData.root ,mediaData.title, 'video');
            articleMedia.appendChild(mediaElement);
            mediaElement.classList.add('medias');
            
            mediaElement.id = 'video';

        } else if (mediaData.type === 'image') {
            const mediaElement = createMediaElement(mediaData.root, mediaData.title, 'img');
            articleMedia.appendChild(mediaElement);
            mediaElement.classList.add('medias');
            mediaElement.id = 'image';
        }

        const mediaInfo = document.createElement('div');
        mediaInfo.classList.add( 'mediaInfo' );

        const title = document.createElement('p');
        title.textContent = mediaData.title;
        

        const mediaInfoLikes = document.createElement('div');
        mediaInfoLikes.classList.add( 'mediaInfoLikes' );

        const likes = document.createElement( 'p' );
        likes.textContent = mediaData.likes;
        likes.classList.add('numberLikes');


        const heart = document.createElement('i');
        heart.classList.add( 'fa-solid', 'fa-heart','media_heart' );

        mediaInfo.appendChild(title);
        mediaInfoLikes.appendChild(likes);
        mediaInfoLikes.appendChild(heart);

        mediaInfo.appendChild(mediaInfoLikes);
        medias.appendChild(articleMedia);
        articleMedia.appendChild(mediaInfo);
        main.insertBefore(medias, document.querySelector('.stickyInfo'));
        
    });
    
    
    document.querySelectorAll(".medias").forEach((element ,index) => {
        element.addEventListener("click", async () => {
            await openLightbox(photographer, element);
        });    
    });
    
    await addLikes();
    
}

});
