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
// startHeroes - начальный список всех героев
// bannedHeroesList - список героев, которые нужно забаннить
export function createChellangeHeroes(startHeroes, bannedHeroesList) {
   const chellangeHeroes = JSON.parse(JSON.stringify(startHeroes));

   // Проходим по всем героям и банним тех, кто есть в списке забаненных
   chellangeHeroes.forEach((hero) => {
      if (bannedHeroesList.includes(hero.name)) {
         hero.selected = false; // Банним героя (selected = false означает забаннен)
         console.log(`🚫 Забаннен герой: ${hero.name}`);
      }
   });

   console.log(`📊 Всего забаннено героев: ${bannedHeroesList.length}`);
   return chellangeHeroes;
}
