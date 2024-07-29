export function addLogoLink() { 
    const logo = document.querySelector(".logo");
    const link = document.createElement('a');

    link.href = '/Front-End-Fisheye/index.html'; // Lien vers la page d'accueil
    link.setAttribute('aria-label', "Fisheye Home page"); // Ajout d'une étiquette ARIA pour l'accessibilité
    logo.parentNode.insertBefore(link, logo); // Insère le lien avant le logo
    link.appendChild(logo); // Ajoute le logo en tant qu'enfant du lien
}