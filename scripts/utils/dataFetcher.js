// Fonction pour récupérer les données d'un photographe par ID
export async function fetchDataAndFilterById(id) {
	// Vérifie si les données sont déjà présentes dans le localStorage
	const storedData = localStorage.getItem("photographersData");
	let data;

	// Si les données sont trouvées dans le localStorage, les parse
	if (storedData) {
		data = JSON.parse(storedData);
	} else {
		// Sinon, récupère les données depuis le fichier JSON
		const response = await fetch("data/photographers.json");
		data = await response.json();
		// Stocke les données dans le localStorage
		localStorage.setItem("photographersData", JSON.stringify(data));
	}

	// Trouve le photographe correspondant à l'ID
	const photographer = data.photographers.find(p => p.id == id);
	return { photographer, data }; // Retourne le photographe et les données
}

// Fonction pour récupérer toutes les données des photographes
export async function getPhotographersData() {
	const storedData = localStorage.getItem("photographersData");
	if (storedData) {
		return JSON.parse(storedData); // Retourne les données si elles sont dans le localStorage
	} else {
		// Sinon, récupère les données depuis le fichier JSON
		const response = await fetch("data/photographers.json");
		const data = await response.json();
		// Stocke les données dans le localStorage
		localStorage.setItem("photographersData", JSON.stringify(data));
		return data; // Retourne les données
	}
}