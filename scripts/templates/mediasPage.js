export function createPicture(source, description, parent) {
    const img = document.createElement('img');
    img.setAttribute("src", source);
    img.setAttribute("alt", description);
    img.classList.add('media');
    parent.appendChild(img);
    return (img);
}
 export function createText(type, content, parent, optionClass){
    const balise = document.createElement(type);
    balise.textContent = content;
    parent.appendChild(balise);
    if (optionClass) {
        balise.classList.add(optionClass);
    }
    return balise;
}

 export function createMediaElement(src, alt, mediatype) {
    const mediaElement = document.createElement(mediatype);
    mediaElement.src = src;
    mediaElement.setAttribute('alt', alt)
    return mediaElement;
}
  