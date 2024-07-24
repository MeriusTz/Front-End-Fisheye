import { createPicture, createText, createMediaElement } from '../templates/mediasPage.js';
import { mediaFactory } from '../utils/mediaFactory.js';
import { addLikes, printTotalLikes } from '../utils/likes.js';
import { fetchDataAndFilterById } from '../utils/dataFetcher.js';
import { addLogoLink } from '../utils/logo.js';
import { openLightbox, initializeLightbox } from '../utils/lightbox.js';

const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");
const lbopen = false;

fetchDataAndFilterById(id).then(({ photographer, data }) => {

    document.title = `Fisheye - ${photographer.name}`;

    // Nom dans la modale
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
        await printMedias(sortedMedia);
        initializeLightbox(photographer); // Initialiser les écouteurs d'événements
    }

    function photographerProfile() {
        const main = document.getElementById('main');
        const photographHeader = document.querySelector('.photograph-header');
        const contactButton = photographHeader.querySelector('.contact_button');
        const picture = `assets/photographers/${photographer.portrait}`;

        createPicture(picture, `Photo de ${photographer.name}`, photographHeader);

        const photographInfo = document.createElement('div');
        photographHeader.insertBefore(photographInfo, contactButton);

        createText('h2', photographer.name, photographInfo);
        createText('p', `${photographer.city}, ${photographer.country}`, photographInfo, 'location');
        createText('p', photographer.tagline, photographInfo);
    }

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
            initializeLightbox(photographer); // Réinitialiser les écouteurs d'événements
            console.log('Médias triés selon', selectedValue, ':', sortedMedia);
        });
    }

    async function printMedias(sortedMedia) {
        let medias = document.createElement('section');
        medias.classList.add('media_section');

        let totalLikesValue = 0;

        sortedMedia.forEach(m => {
            const mediaData = mediaFactory(m);

            const articleMedia = document.createElement('article');
            articleMedia.classList.add('media_article');

            main.appendChild(articleMedia);

            if (mediaData.type === 'video') {
                const mediaElement = createMediaElement(mediaData.root, mediaData.title, 'video');
                articleMedia.appendChild(mediaElement);
                mediaElement.classList.add('medias');
                mediaElement.setAttribute('tabindex', '0');
                mediaElement.id = 'video';

            } else if (mediaData.type === 'image') {
                const mediaElement = createMediaElement(mediaData.root, mediaData.title, 'img');
                articleMedia.appendChild(mediaElement);
                mediaElement.classList.add('medias');
                mediaElement.setAttribute('tabindex', '0');
                mediaElement.id = 'image';
            }

            const mediaInfo = document.createElement('div');
            mediaInfo.classList.add('mediaInfo');

            const title = document.createElement('p');
            title.textContent = mediaData.title;

            const mediaInfoLikes = document.createElement('div');
            mediaInfoLikes.classList.add('mediaInfoLikes');

            const likes = document.createElement('p');
            likes.textContent = mediaData.likes;
            likes.classList.add('numberLikes');

            const heart = document.createElement('i');
            heart.classList.add('fa-solid', 'fa-heart', 'media_heart');
            heart.setAttribute('tabindex', '0');
            mediaInfo.appendChild(title);
            mediaInfoLikes.appendChild(likes);
            mediaInfoLikes.appendChild(heart);

            mediaInfo.appendChild(mediaInfoLikes);
            medias.appendChild(articleMedia);
            articleMedia.appendChild(mediaInfo);
            main.insertBefore(medias, document.querySelector('.stickyInfo'));
        });

        await addLikes();

        // Mettre à jour les éléments de médias et réinitialiser les écouteurs d'événements
        initializeLightbox(photographer);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const customSelectTrigger = document.querySelector('.custom-select-trigger');
    const customOptions = document.querySelector('.custom-options');
    const customOptionElements = document.querySelectorAll('.custom-option');
    const filterSelect = document.getElementById('filter');

    console.log('Custom Select Trigger:', customSelectTrigger);
    console.log('Custom Options:', customOptions);
    console.log('Custom Option Elements:', customOptionElements);
    console.log('Filter Select:', filterSelect);

    if (!filterSelect) {
        console.error('Element with ID "filter" not found.');
        return;
    }

    customSelectTrigger.setAttribute('tabindex', '0');
    customOptionElements.forEach((option) => {
        option.setAttribute('tabindex', '-1');
    });

    customSelectTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Custom Select Trigger clicked');
        customOptions.classList.toggle('open');
        customSelectTrigger.classList.toggle('open');
        updateOptionDisplay();
        focusFirstVisibleOption();
    });

    customSelectTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            customOptions.classList.toggle('open');
            customSelectTrigger.classList.toggle('open');
            updateOptionDisplay();
            focusFirstVisibleOption();
        }
    });

    customOptionElements.forEach((option, index) => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log('Option clicked:', option);
            customOptionElements.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            customSelectTrigger.querySelector('span').textContent = option.textContent;
            customOptions.classList.remove('open');
            customSelectTrigger.classList.remove('open');

            // Trigger change event equivalent for the original select
            const event = new Event('change');
            filterSelect.value = option.getAttribute('data-value');
            filterSelect.dispatchEvent(event);
            customSelectTrigger.focus();
        });

        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
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

    window.addEventListener('click', (e) => {
        if (!customSelectTrigger.contains(e.target) && !customOptions.contains(e.target)) {
            customOptions.classList.remove('open');
            customSelectTrigger.classList.remove('open');
        }
    });

    window.addEventListener('focusin', (e) => {
        if (!customSelectTrigger.contains(e.target) && !customOptions.contains(e.target)) {
            customOptions.classList.remove('open');
            customSelectTrigger.classList.remove('open');
        }
    });

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

    function focusFirstVisibleOption() {
        for (const option of customOptionElements) {
            if (option.style.display !== 'none') {
                option.focus();
                break;
            }
        }
    }

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
