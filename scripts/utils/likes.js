
import { fetchDataAndFilterById } from './dataFetcher.js';

export async function addLikes() {
    const mediaHearts = document.querySelectorAll('.media_heart');

    mediaHearts.forEach(heart => {
        let liked = false;

        const toggleLike = () => {
            const likesElement = heart.parentNode.querySelector('.numberLikes');
            const totalLikesElement = document.querySelector('.totalLikes');
        
            if (!liked) {
                const likes = parseInt(likesElement.textContent);
                likesElement.textContent = likes + 1;
        
                const totalLikes = parseInt(totalLikesElement.textContent);
                totalLikesElement.textContent = totalLikes + 1;
                heart.classList.add('liked');
                heart.classList.remove('unliked');
                liked = true;
            } else {
                // Fonctionnalité d'annulation du like
                const likes = parseInt(likesElement.textContent);
                likesElement.textContent = likes - 1;
        
                const totalLikes = parseInt(totalLikesElement.textContent);
                totalLikesElement.textContent = totalLikes - 1;
                heart.classList.add('unliked');
                heart.classList.remove('liked');
                liked = false;
            }
        };
        
        heart.addEventListener('click', toggleLike);
        heart.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
        toggleLike();
    }
});
    });
}


export async function printTotalLikes() {
    const mediaSection = document.querySelector('.media_section');
fetchDataAndFilterById(id).then(({ photographer, data }) => {

    const numberLikes = document.querySelectorAll('.numberLikes');
    let totalLikesValue = 0;

    numberLikes.forEach(numberLike => {
        const likes = parseInt(numberLike.textContent);
        totalLikesValue = totalLikesValue + likes;
    });

    
    const stickyInfo = document.createElement('div');
    stickyInfo.classList.add('stickyInfo');

    const stickyLikes = document.createElement('div');
    stickyLikes.classList.add('stickyLikes');

    const totalLikes = document.createElement('p');
    totalLikes.classList.add('totalLikes');
    totalLikes.textContent = totalLikesValue;

    const stickyHeart = document.createElement('i');
    stickyHeart.classList.add('fa-solid', 'fa-heart', 'stickyHeart');

    const stickyPrice = document.createElement( 'p' );
    stickyPrice.textContent = `${photographer.price}€ / jour`; ;

    stickyLikes.appendChild(totalLikes);
    stickyLikes.appendChild(stickyHeart);

    stickyInfo.appendChild(stickyLikes);
    stickyInfo.appendChild(stickyPrice);

    main.appendChild(stickyInfo);
});
}