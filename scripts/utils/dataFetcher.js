export async function fetchDataAndFilterById(id) {
  const response = await fetch('data/photographers.json'); // Récupère les données des photographes à partir du fichier JSON
  const data = await response.json(); // Convertit les données en JSON
  const photographer = data.photographers.find(p => p.id == id); // Trouve le photographe correspondant à l'ID
  return { photographer, data }; // Retourne le photographe et toutes les données
}
