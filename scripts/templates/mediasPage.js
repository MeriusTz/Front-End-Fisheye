export function createPicture(source, description, parent) {
    const img = document.createElement('img');
    img.setAttribute("src", source);
    img.setAttribute("alt", description);
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

export function createVideo(src, alt) {
    const video = document.createElement('video');
    video.src = src;
    video.alt = alt;
    return video;
  }