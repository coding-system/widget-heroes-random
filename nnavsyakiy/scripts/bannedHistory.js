// Функция для загрузки истории банов из JSON файла
export async function loadBannedHistory() {
   try {
      const response = await fetch("./scripts/bannedHistory.json");
      const data = await response.json();
      return data.bannedHeroes;
   } catch (error) {
      console.error("Ошибка при загрузке истории банов:", error);
      return [];
   }
}

// Функция для создания массива героев с забаненными героями
export function createChellangeHeroes(startHeroes, playedHeroesList) {
   const chellangeHeroes = JSON.parse(JSON.stringify(startHeroes));
   chellangeHeroes.forEach((hero) => {
      if (playedHeroesList.includes(hero.name)) {
         hero.selected = false;
      }
   });
   return chellangeHeroes;
}
