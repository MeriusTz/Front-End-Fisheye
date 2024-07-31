// Fonction pour créer une instance de média
export function mediaFactory(data){
    
	if (data.image) {
		return new mediaImage(data);
	} else if (data.video) {
		return new mediaVideo(data);
	} else{
		throw new Error("media type not found"); 
	}
}

// Classe pour les médias de type image
class mediaImage {
	constructor(data) {
		this.id = data.id;
		this.photographerId = data.photographerId;
		this.title = data.title;
		this.image = data.image;
		this.likes = data.likes;
		this.date = data.date;
		this.price = data.price;
		this.type = "image";
		this.root = `assets/images/medias/${this.photographerId}/${this.image}`; // Chemin vers l'image
	}
}

// Classe pour les médias de type vidéo
class mediaVideo {
	constructor(data) {
		this.id = data.id;
		this.photographerId = data.photographerId;
		this.title = data.title;
		this.video = data.video;
		this.likes = data.likes;
		this.date;
		this.price = data.price;
		this.type = "video";
		this.root = `assets/images/medias/${this.photographerId}/${this.video}`; // Chemin vers la vidéo
	}
}