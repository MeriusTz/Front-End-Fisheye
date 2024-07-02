import { createPicture, createText } from '../templates/mediasPage.js';
import { mediaFactory  } from '../utils/mediaFactory.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

fetch('data/photographers.json')
.then(response => response.json())
.then(data => {
    const photographer = data.photographers.find(p => p.id == id);

    //Nom dans la modale
    const h2 = document.createElement('h2');
    h2.textContent = photographer.name;
    h2.classList.add('modal_header_name');
    headerModal.insertAdjacentElement('afterend', h2);



    init();

async function init() {
    photographerProfile();
    printMedias();
    printTotalLikes();
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

function createMediaElement(src, alt, mediatype) {
    const mediaElement = document.createElement(mediatype);
    mediaElement.src = src;
    mediaElement.alt = alt;
    return mediaElement;
}

function printMedias(){
    const medias = document.createElement('section');
    medias.classList.add('medias');
    
    let media = data.media.filter(m => m.photographerId == id);
    var totalLikesValue = 0;
    media.forEach(m => {
        
        const mediaData = mediaFactory(m);

        const articleMedia = document.createElement('article');

        main.appendChild(articleMedia);
        

        if(mediaData.type === 'video') {
            const mediaElement = createMediaElement(mediaData.root , mediaData.title, 'video');
            articleMedia.appendChild(mediaElement);
            mediaElement.classList.add('medias');

        } else if (mediaData.type === 'image') {
            const mediaElement = createMediaElement(mediaData.root, mediaData.title, 'img');
            articleMedia.appendChild(mediaElement);
            mediaElement.classList.add('medias');
        }

        const mediaInfo = document.createElement('div');
        mediaInfo.classList.add( 'mediaInfo' );

        const title = document.createElement('p');
        title.textContent = mediaData.title;
        

        const mediaInfoLikes = document.createElement('div');
        mediaInfoLikes.classList.add( 'mediaInfoLikes' );

        const likes = document.createElement( 'p' );
        likes.textContent = mediaData.likes;
        


        const heart = document.createElement('i');
        heart.classList.add( 'fa-solid', 'fa-heart' );

        mediaInfo.appendChild(title);
        mediaInfoLikes.appendChild(likes);
        mediaInfoLikes.appendChild(heart);

        mediaInfo.appendChild(mediaInfoLikes);
        medias.appendChild(articleMedia);
        articleMedia.appendChild(mediaInfo);
        main.appendChild(medias);
        

        
        
        
    });
}

    function printTotalLikes() {

        let media = data.media.filter(m => m.photographerId == id);
        var totalLikesValue = 0;
        media.forEach(m => {

        totalLikesValue = totalLikesValue + m.likes;
    });

    const stickyInfo = document.createElement('div');
    stickyInfo.classList.add( 'stickyInfo' );

    const stickyLikes = document.createElement('div');
    stickyLikes.classList.add( 'stickyLikes' );

    const totalLikes = document.createElement('p');
    totalLikes.textContent = totalLikesValue;
    
    const stickyHeart = document.createElement('i');
    stickyHeart.classList.add( 'fa-solid', 'fa-heart', 'stickyHeart' );



    const stickyPrice = document.createElement( 'p' );
    stickyPrice.textContent = `${photographer.price}€ / jour`; ;
    


    stickyLikes.appendChild(totalLikes);
    stickyLikes.appendChild(stickyHeart);
    
    stickyInfo.appendChild(stickyLikes);
    stickyInfo.appendChild(stickyPrice);


    main.appendChild(stickyInfo);

    }

});