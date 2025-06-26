// Интеграция автоматически забаненных героев с основной логикой

// Функция для получения всех забаненных героев (ручные + автоматические)
export function getAllBannedHeroes() {
   const manualBanned = JSON.parse(
      localStorage.getItem("bannedHeroes") || "[]"
   );
   const autoBanned = JSON.parse(
      localStorage.getItem("autoBannedHeroes") || '{"autoBannedHeroes": []}'
   );

   // Объединяем списки и убираем дубликаты
   const allBanned = [...manualBanned, ...autoBanned.autoBannedHeroes];
   const uniqueBanned = [...new Set(allBanned)];

   return uniqueBanned;
}

// Функция для получения только автоматически забаненных героев
export function getAutoBannedHeroes() {
   const autoBanned = JSON.parse(
      localStorage.getItem("autoBannedHeroes") || '{"autoBannedHeroes": []}'
   );
   return autoBanned.autoBannedHeroes || [];
}

// Функция для получения только ручно забаненных героев
export function getManualBannedHeroes() {
   return JSON.parse(localStorage.getItem("bannedHeroes") || "[]");
}

// Функция для проверки, забанен ли герой автоматически
export function isHeroAutoBanned(heroName) {
   const autoBanned = getAutoBannedHeroes();
   return autoBanned.includes(heroName);
}

// Функция для проверки, забанен ли герой вручную
export function isHeroManualBanned(heroName) {
   const manualBanned = getManualBannedHeroes();
   return manualBanned.includes(heroName);
}

// Функция для получения типа бана героя
export function getHeroBanType(heroName) {
   const isAuto = isHeroAutoBanned(heroName);
   const isManual = isHeroManualBanned(heroName);

   if (isAuto && isManual) {
      return "both"; // Забанен и автоматически, и вручную
   } else if (isAuto) {
      return "auto"; // Только автоматически
   } else if (isManual) {
      return "manual"; // Только вручную
   } else {
      return "none"; // Не забанен
   }
}

// Функция для создания массива героев с учетом всех типов банов
export function createHeroesWithAllBans(startHeroes) {
   const allBanned = getAllBannedHeroes();
   const chellangeHeroes = JSON.parse(JSON.stringify(startHeroes));

   chellangeHeroes.forEach((hero) => {
      if (allBanned.includes(hero.name)) {
         hero.selected = false;
         hero.banType = getHeroBanType(hero.name);
      } else {
         hero.banType = "none";
      }
   });

   return chellangeHeroes;
}

// Функция для вывода статистики банов в консоль
export function logBanStatistics() {
   const manualBanned = getManualBannedHeroes();
   const autoBanned = getAutoBannedHeroes();
   const allBanned = getAllBannedHeroes();

   console.log("📊 Статистика банов:");
   console.log(`🎯 Ручные баны: ${manualBanned.length} героев`);
   console.log(`🤖 Автоматические баны: ${autoBanned.length} героев`);
   console.log(`📋 Всего забанено: ${allBanned.length} героев`);

   if (autoBanned.length > 0) {
      console.log("🤖 Автоматически забаненные герои:", autoBanned);
   }

   if (manualBanned.length > 0) {
      console.log("🎯 Ручные баны:", manualBanned);
   }
}

// Функция для очистки только автоматических банов
export function clearAutoBans() {
   localStorage.removeItem("autoBannedHeroes");
   console.log("🗑️ Автоматические баны очищены из localStorage");
}

// Функция для очистки только ручных банов
export function clearManualBans() {
   localStorage.removeItem("bannedHeroes");
   console.log("🗑️ Ручные баны очищены из localStorage");
}

// Функция для очистки всех банов
export function clearAllBans() {
   clearAutoBans();
   clearManualBans();
   console.log("🗑️ Все баны очищены из localStorage");
}

// Экспорт функций в глобальную область для использования в консоли
window.getAllBannedHeroes = getAllBannedHeroes;
window.getAutoBannedHeroes = getAutoBannedHeroes;
window.getManualBannedHeroes = getManualBannedHeroes;
window.isHeroAutoBanned = isHeroAutoBanned;
window.isHeroManualBanned = isHeroManualBanned;
window.getHeroBanType = getHeroBanType;
window.logBanStatistics = logBanStatistics;
window.clearAutoBans = clearAutoBans;
window.clearManualBans = clearManualBans;
window.clearAllBans = clearAllBans;
