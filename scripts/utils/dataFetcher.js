export async function fetchDataAndFilterById(id) {
  const response = await fetch('data/photographers.json');
  const data = await response.json();
  const photographer = data.photographers.find(p => p.id == id);
  return { photographer, data };
  }