import { addLikes } from '../utils/likes.js';
import { mediaFactory } from '../utils/mediaFactory.js';
import { initializeLightbox } from '../utils/lightbox.js';


// Template pour afficher les photographes 
function photographerTemplate(data) {
    const { name, id, city, country, tagline, price, portrait } = data;
    const picture = `assets/photographers/${portrait}`;

    // Fonction pour obtenir le DOM du photographe
    function getUserCardDOM() {
        const article = document.createElement('article');
        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.setAttribute('aria-label', `Voir les médias de ${name}`);
        link.tabIndex = 0;

        const img = document.createElement('img');
        img.setAttribute("src", picture);
        img.setAttribute("alt", `Photo de ${name}`);

        const h2 = document.createElement('h2');
        h2.textContent = name;

        link.appendChild(img);
        link.appendChild(h2);

        const location = document.createElement('p');
        location.textContent = `${city}, ${country}`;
        location.classList.add('location');
        location.setAttribute('aria-label', `Localisation de ${name}`);

        const description = document.createElement('p');
        description.textContent = tagline;
        description.setAttribute('aria-label', `Description de ${name}`);

        const prix = document.createElement('p');
        prix.textContent = `${price}€/jour`;
        prix.classList.add('price');
        prix.setAttribute('aria-label', `Prix journalier de ${name}`);

        article.appendChild(link);
        article.appendChild(location);
        article.appendChild(description);
        article.appendChild(prix);
        return (article);
    }
    return { name, id, city, country, tagline, price, portrait, getUserCardDOM };
}

// Classe abstraite définissant le modèle de page média
class MediaPageTemplate {
    constructor(data, id, main, photographer) {
        if (this.constructor === MediaPageTemplate) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.data = data;
        this.id = id;  
        this.main = main;  
        this.photographer = photographer;  
    }

    // Méthode template pour afficher la page
    async displayPage() {
        this.clearPage();  // Nettoie la page
        const sortedMedia = this.sortMedia();  // Trie les médias
        await this.printMedias(sortedMedia);  // Affiche les médias triés
        addLikes();  
        initializeLightbox();  
    }

    // Méthode pour nettoyer la page
    clearPage() {
        const mediaSection = document.querySelector('.media_section');
        if (mediaSection) {
            mediaSection.remove();  // Supprime la section des médias
        }
    }



    // Méthode pour afficher les médias
    async printMedias(sortedMedia) {

        let medias = document.createElement('section');
        medias.classList.add('media_section');
        sortedMedia.forEach(m => {

            const mediaData = mediaFactory(m);
            const articleMedia = document.createElement('article');
            articleMedia.classList.add('media_article');
            this.main.appendChild(articleMedia);
            const mediaElement = document.createElement(mediaData.type === 'video' ? 'video' : 'img');
            mediaElement.src = mediaData.root;
            mediaElement.setAttribute('alt', `${mediaData.title} de ${this.photographer.name}`);
            articleMedia.appendChild(mediaElement);
            mediaElement.classList.add('medias');
            mediaElement.setAttribute('tabindex', '0');
            mediaElement.id = mediaData.type;
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
            this.main.insertBefore(medias, document.querySelector('.stickyInfo'));
        });
    }

}

// Classe pour trier les médias par popularité
class PopularityMediaPage extends MediaPageTemplate {
    sortMedia() {
        let filteredMedia = this.data.media.filter(m => m.photographerId == this.id);
        return filteredMedia.sort((a, b) => b.likes - a.likes);
    }
}

// Classe pour trier les médias par date
class DateMediaPage extends MediaPageTemplate {
    sortMedia() {
        let filteredMedia = this.data.media.filter(m => m.photographerId == this.id);
        return filteredMedia.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}

// Classe pour trier les médias par titre
class TitleMediaPage extends MediaPageTemplate {
    sortMedia() {
        let filteredMedia = this.data.media.filter(m => m.photographerId == this.id);
        return filteredMedia.sort((a, b) => a.title.localeCompare(b.title));
    }
}

// Export des fonctions et des classes
export { photographerTemplate, MediaPageTemplate, PopularityMediaPage, DateMediaPage, TitleMediaPage };
