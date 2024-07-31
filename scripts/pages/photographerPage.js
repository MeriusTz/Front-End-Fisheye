import { PopularityMediaPage, DateMediaPage, TitleMediaPage, displayPhotographerProfile, handleCustomSelectInteractions } from "../templates/photographer.js";
import { fetchDataAndFilterById } from "../utils/dataFetcher.js";
import { addLogoLink } from "../utils/logo.js";
import { printTotalLikes } from "../utils/likes.js";

// Récupère l'ID du photographe à partir de l'URL
const urlSearchParams = new URLSearchParams(window.location.search);
const id = urlSearchParams.get("id");

// Récupère les données du photographe et les médias associés
fetchDataAndFilterById(id).then(({ photographer, data }) => {
	// Met à jour le titre de la page avec le nom du photographe
	document.title = `Fisheye - ${photographer.name}`;
	// Initialise la page du photographe
	init();

	async function init() {
		addLogoLink(); 
		displayPhotographerProfile(photographer); 
		printTotalLikes(); 
		await mediaSorter("popularite"); 
		handleCustomSelectInteractions();
	}

	// Fonction pour trier et afficher les médias en fonction de la sélection
	async function mediaSorter(selectedValue) {
		const main = document.getElementById("main");
		let mediaPage;

		// Sélectionne le tri approprié en fonction de la valeur sélectionnée
		if (selectedValue === "popularite") {
			mediaPage = new PopularityMediaPage(data, id, main, photographer);
		} else if (selectedValue === "date") {
			mediaPage = new DateMediaPage(data, id, main, photographer);
		} else if (selectedValue === "titre") {
			mediaPage = new TitleMediaPage(data, id, main, photographer);
		}

		// Affiche la page des médias triés
		if (mediaPage) {
			await mediaPage.displayPage();
		}
	}

	// Écouteur d'événement pour le changement de filtre de tri
	document.getElementById("filter").addEventListener("change", async (event) => {
		const selectedValue = event.target.value;
		await mediaSorter(selectedValue);
	});
}); 