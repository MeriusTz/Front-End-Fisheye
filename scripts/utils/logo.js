export function addLogoLink() { // Importable dans les autres js
    const logo = document.querySelector(".logo");
    const link = document.createElement('a');

    link.href = 'index.html';
    link.setAttribute('aria-label', "Fisheye Home page");
    logo.parentNode.insertBefore(link, logo);
    link.appendChild(logo);      
    }