function photographerTemplate(data) {

    const { name, id, city, country, tagline, price, portrait } = data;

    const picture = `assets/photographers/${portrait}`;

    function getUserCardDOM() {
        
        const article = document.createElement( 'article' );
        const link = document.createElement('a');
        link.setAttribute('href', `photographer.html?id=${id}`);
        link.setAttribute('aria-label', `Voir les médias de ${name}`);
        link.tabIndex = 0;

        const img = document.createElement('img');
        // Attribut alt pour l'accessibilité des images
        img.setAttribute("src", picture);
        img.setAttribute("alt", `Photo de ${name}`);

        
        const h2 = document.createElement('h2');
        h2.textContent = name;
        
        link.appendChild(img);
        link.appendChild(h2);

        const location = document.createElement( 'p' );
        location.textContent = `${city}, ${country}`;
        location.classList.add( 'location' );
        location.setAttribute('aria-label', `Localisation de ${name}`);

        const description = document.createElement( 'p' );
        description.textContent = tagline;
        description.setAttribute('aria-label', `Description de ${name}`);
        
        
        const prix = document.createElement( 'p' );
        prix.textContent = `${price}€/jour`;
        prix.classList.add( 'price' );
        prix.setAttribute('aria-label', `Prix journalier de ${name}`);


        article.appendChild(link);
        article.appendChild(location);
        article.appendChild(description);
        article.appendChild(prix);
        return (article);
    }
    return { name, id, city, country, tagline, price, portrait, getUserCardDOM }
}       


