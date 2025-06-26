// Константы для настройки
const PLAYER_ID = 1892794016;
const START_MATCH_ID = 8316568444;
const CHECK_INTERVAL_MINUTES = 30;
const OPENDOTA_API_BASE = "https://api.opendota.com/api";

// Класс для работы с автоматическим отслеживанием героев
class AutoHeroTracker {
   constructor() {
      this.lastCheckedMatchId = START_MATCH_ID;
      this.autoBannedHeroes = [];
      this.isRunning = false;
      this.intervalId = null;
   }

   // Инициализация трекера
   async init() {
      console.log("🚀 Инициализация AutoHeroTracker...");
      await this.loadAutoBannedHeroes();
      await this.checkForNewMatches();
      this.startPeriodicCheck();
      console.log("✅ AutoHeroTracker инициализирован");
   }

   // Загрузка существующих автоматически забаненных героев
   async loadAutoBannedHeroes() {
      try {
         const savedData = localStorage.getItem("autoBannedHeroes");
         if (savedData) {
            const data = JSON.parse(savedData);
            this.autoBannedHeroes = data.autoBannedHeroes || [];
            console.log(
               `📋 Загружено ${this.autoBannedHeroes.length} автоматически забаненных героев из localStorage`
            );
         } else {
            console.log(
               "📋 Данные в localStorage не найдены, начинаем с пустого списка"
            );
            this.autoBannedHeroes = [];
         }
      } catch (error) {
         console.error("❌ Ошибка при загрузке из localStorage:", error);
         this.autoBannedHeroes = [];
      }
   }

   // Сохранение автоматически забаненных героев
   async saveAutoBannedHeroes() {
      try {
         const data = {
            autoBannedHeroes: this.autoBannedHeroes,
         };

         // Сохраняем в localStorage
         localStorage.setItem("autoBannedHeroes", JSON.stringify(data));
         console.log(
            "💾 Автоматически забаненные герои сохранены в localStorage"
         );
         console.log(
            "📊 Текущий список автоматически забаненных героев:",
            this.autoBannedHeroes
         );
      } catch (error) {
         console.error("❌ Ошибка при сохранении в localStorage:", error);
      }
   }

   // Получение матчей игрока
   async getPlayerMatches() {
      try {
         const url = `${OPENDOTA_API_BASE}/players/${PLAYER_ID}/matches`;
         console.log(`🔍 Запрос матчей игрока ${PLAYER_ID}...`);

         const response = await fetch(url);
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const matches = await response.json();
         console.log(`📊 Получено ${matches.length} матчей`);
         return matches;
      } catch (error) {
         console.error("❌ Ошибка при получении матчей:", error);
         return [];
      }
   }

   // Получение деталей матча
   async getMatchDetails(matchId) {
      try {
         const url = `${OPENDOTA_API_BASE}/matches/${matchId}`;
         const response = await fetch(url);
         if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
         }

         const matchDetails = await response.json();
         return matchDetails;
      } catch (error) {
         console.error(
            `❌ Ошибка при получении деталей матча ${matchId}:`,
            error
         );
         return null;
      }
   }

   // Получение имени героя по ID
   getHeroName(heroId) {
      const heroNames = {
         1: "Anti-Mage",
         2: "Axe",
         3: "Bane",
         4: "Bloodseeker",
         5: "Crystal Maiden",
         6: "Drow Ranger",
         7: "Earthshaker",
         8: "Juggernaut",
         9: "Mirana",
         10: "Morphling",
         11: "Shadow Fiend",
         12: "Phantom Lancer",
         13: "Puck",
         14: "Pudge",
         15: "Razor",
         16: "Sand King",
         17: "Storm Spirit",
         18: "Sven",
         19: "Tiny",
         20: "Vengeful Spirit",
         21: "Windranger",
         22: "Zeus",
         23: "Kunkka",
         25: "Lina",
         26: "Lion",
         27: "Shadow Shaman",
         28: "Slardar",
         29: "Tidehunter",
         30: "Witch Doctor",
         31: "Lich",
         32: "Riki",
         33: "Enigma",
         34: "Tinker",
         35: "Sniper",
         36: "Necrophos",
         37: "Warlock",
         38: "Beastmaster",
         39: "Queen of Pain",
         40: "Venomancer",
         41: "Faceless Void",
         42: "Wraith King",
         43: "Death Prophet",
         44: "Phantom Assassin",
         45: "Pugna",
         46: "Templar Assassin",
         47: "Viper",
         48: "Luna",
         49: "Dragon Knight",
         50: "Dazzle",
         51: "Clockwerk",
         52: "Leshrac",
         53: "Nature's Prophet",
         54: "Lifestealer",
         55: "Dark Seer",
         56: "Clinkz",
         57: "Omniknight",
         58: "Enchantress",
         59: "Huskar",
         60: "Night Stalker",
         61: "Broodmother",
         62: "Bounty Hunter",
         63: "Weaver",
         64: "Jakiro",
         65: "Batrider",
         66: "Chen",
         67: "Spectre",
         68: "Ancient Apparition",
         69: "Doom",
         70: "Ursa",
         71: "Spirit Breaker",
         72: "Gyrocopter",
         73: "Alchemist",
         74: "Invoker",
         75: "Silencer",
         76: "Outworld Destroyer",
         77: "Lycan",
         78: "Brewmaster",
         79: "Shadow Demon",
         80: "Lone Druid",
         81: "Chaos Knight",
         82: "Meepo",
         83: "Treant Protector",
         84: "Ogre Magi",
         85: "Undying",
         86: "Rubick",
         87: "Disruptor",
         88: "Nyx Assassin",
         89: "Naga Siren",
         90: "Keeper of the Light",
         91: "IO",
         92: "Visage",
         93: "Slark",
         94: "Medusa",
         95: "Troll Warlord",
         96: "Centaur Warrunner",
         97: "Magnus",
         98: "Timbersaw",
         99: "Bristleback",
         100: "Tusk",
         101: "Skywrath Mage",
         102: "Abaddon",
         103: "Elder Titan",
         104: "Legion Commander",
         105: "Techies",
         106: "Ember Spirit",
         107: "Earth Spirit",
         108: "Abyssal Underlord",
         109: "Terrorblade",
         110: "Phoenix",
         111: "Oracle",
         112: "Winter Wyvern",
         113: "Arc Warden",
         114: "Monkey King",
         119: "Dark Willow",
         120: "Pangolier",
         121: "Grimstroke",
         123: "Hoodwink",
         126: "Void Spirit",
         128: "Snapfire",
         129: "Mars",
         135: "Dawnbreaker",
         136: "Marci",
         137: "Primal Beast",
         138: "Muerta",
         139: "Ringmaster",
      };

      return heroNames[heroId] || `Unknown Hero (${heroId})`;
   }

   // Проверка новых матчей и добавление героев
   async checkForNewMatches() {
      try {
         console.log("🔍 Проверка новых матчей...");
         const matches = await this.getPlayerMatches();

         if (matches.length === 0) {
            console.log("📭 Матчи не найдены");
            return;
         }

         // Фильтруем матчи после START_MATCH_ID (не включая его)
         const newMatches = matches.filter(
            (match) =>
               match.match_id > START_MATCH_ID &&
               match.match_id > this.lastCheckedMatchId
         );

         if (newMatches.length === 0) {
            console.log("📭 Новых матчей не найдено");
            return;
         }

         console.log(`🎮 Найдено ${newMatches.length} новых матчей`);

         // Обрабатываем все матчи локально без дополнительных запросов
         await this.processMatchesLocally(newMatches);

         // Обновляем ID последнего проверенного матча
         if (newMatches.length > 0) {
            this.lastCheckedMatchId = Math.max(
               ...newMatches.map((m) => m.match_id)
            );
         }

         // Сохраняем обновленный список
         await this.saveAutoBannedHeroes();
      } catch (error) {
         console.error("❌ Ошибка при проверке новых матчей:", error);
      }
   }

   // Обработка матчей локально (без дополнительных запросов к API)
   async processMatchesLocally(matches) {
      try {
         console.log("🔄 Обработка матчей локально...");

         for (const match of matches) {
            console.log(`🎯 Обработка матча ${match.match_id}...`);

            // Получаем героя из данных матча (если доступно)
            const heroId = match.hero_id;
            if (heroId) {
               const heroName = this.getHeroName(heroId);

               // Добавляем героя в список, если его там еще нет
               if (!this.autoBannedHeroes.includes(heroName)) {
                  this.autoBannedHeroes.push(heroName);
                  console.log(
                     `✅ Добавлен новый герой: ${heroName} (из матча ${match.match_id})`
                  );
               } else {
                  console.log(`ℹ️ Герой ${heroName} уже в списке`);
               }
            } else {
               console.log(`⚠️ ID героя не найден в матче ${match.match_id}`);
            }
         }
      } catch (error) {
         console.error("❌ Ошибка при локальной обработке матчей:", error);
      }
   }

   // Получение всех матчей игрока с деталями
   async getAllPlayerMatchesWithDetails() {
      try {
         console.log("🔍 Запрос всех матчей игрока с деталями...");

         // Получаем список матчей
         const matches = await this.getPlayerMatches();

         if (matches.length === 0) {
            console.log("📭 Матчи не найдены");
            return [];
         }

         console.log(`📊 Получено ${matches.length} матчей`);

         // Фильтруем матчи после START_MATCH_ID (не включая его)
         const relevantMatches = matches.filter(
            (match) => match.match_id > START_MATCH_ID
         );

         console.log(
            `🎯 Найдено ${relevantMatches.length} релевантных матчей после ${START_MATCH_ID}`
         );

         // Получаем детали всех релевантных матчей одним запросом
         const matchIds = relevantMatches.map((match) => match.match_id);
         const matchDetails = await this.getMultipleMatchDetails(matchIds);

         return matchDetails;
      } catch (error) {
         console.error("❌ Ошибка при получении матчей с деталями:", error);
         return [];
      }
   }

   // Получение деталей нескольких матчей
   async getMultipleMatchDetails(matchIds) {
      try {
         console.log(`🔍 Получение деталей ${matchIds.length} матчей...`);

         const matchDetails = [];

         // Обрабатываем матчи пакетами по 10 штук для избежания перегрузки API
         const batchSize = 10;
         for (let i = 0; i < matchIds.length; i += batchSize) {
            const batch = matchIds.slice(i, i + batchSize);
            console.log(
               `📦 Обработка пакета ${
                  Math.floor(i / batchSize) + 1
               }/${Math.ceil(matchIds.length / batchSize)}`
            );

            const batchPromises = batch.map((matchId) =>
               this.getMatchDetails(matchId)
            );
            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach((result, index) => {
               if (result.status === "fulfilled" && result.value) {
                  matchDetails.push(result.value);
               } else {
                  console.log(
                     `⚠️ Не удалось получить детали матча ${batch[index]}`
                  );
               }
            });

            // Небольшая задержка между пакетами
            if (i + batchSize < matchIds.length) {
               await new Promise((resolve) => setTimeout(resolve, 1000));
            }
         }

         console.log(
            `✅ Получено деталей ${matchDetails.length} из ${matchIds.length} матчей`
         );
         return matchDetails;
      } catch (error) {
         console.error("❌ Ошибка при получении деталей матчей:", error);
         return [];
      }
   }

   // Полная обработка всех матчей одним запросом
   async processAllMatchesEfficiently() {
      try {
         console.log("🚀 Начинаем эффективную обработку всех матчей...");

         // Получаем все матчи игрока
         const matches = await this.getPlayerMatches();

         if (matches.length === 0) {
            console.log("📭 Матчи не найдены");
            return;
         }

         console.log(`📊 Получено ${matches.length} матчей`);

         // Фильтруем матчи после START_MATCH_ID (не включая его)
         const relevantMatches = matches.filter(
            (match) => match.match_id > START_MATCH_ID
         );

         console.log(
            `🎯 Найдено ${relevantMatches.length} релевантных матчей после ${START_MATCH_ID}`
         );

         if (relevantMatches.length === 0) {
            console.log("📭 Релевантных матчей не найдено");
            return;
         }

         // Получаем детали всех релевантных матчей
         const matchIds = relevantMatches.map((match) => match.match_id);
         const matchDetails = await this.getMultipleMatchDetails(matchIds);

         // Обрабатываем все матчи локально
         let newHeroesCount = 0;

         for (const matchDetail of matchDetails) {
            if (!matchDetail || !matchDetail.players) {
               continue;
            }

            // Находим нашего игрока в матче
            const playerInMatch = matchDetail.players.find(
               (player) => player.account_id === PLAYER_ID
            );

            if (!playerInMatch) {
               continue;
            }

            // Получаем имя героя
            const heroName = this.getHeroName(playerInMatch.hero_id);

            // Добавляем героя в список, если его там еще нет
            if (!this.autoBannedHeroes.includes(heroName)) {
               this.autoBannedHeroes.push(heroName);
               newHeroesCount++;
               console.log(
                  `✅ Добавлен новый герой: ${heroName} (из матча ${matchDetail.match_id})`
               );
            }
         }

         // Обновляем ID последнего проверенного матча
         if (relevantMatches.length > 0) {
            this.lastCheckedMatchId = Math.max(
               ...relevantMatches.map((m) => m.match_id)
            );
         }

         // Сохраняем обновленный список
         await this.saveAutoBannedHeroes();

         console.log(
            `🎉 Обработка завершена! Добавлено ${newHeroesCount} новых героев`
         );
         console.log(
            `📊 Всего автоматически забаненных героев: ${this.autoBannedHeroes.length}`
         );
      } catch (error) {
         console.error("❌ Ошибка при эффективной обработке матчей:", error);
      }
   }

   // Обработка отдельного матча (оставляем для совместимости)
   async processMatch(match) {
      try {
         console.log(`🎯 Обработка матча ${match.match_id}...`);

         const matchDetails = await this.getMatchDetails(match.match_id);
         if (!matchDetails) {
            console.log(
               `⚠️ Не удалось получить детали матча ${match.match_id}`
            );
            return;
         }

         // Находим нашего игрока в матче
         const playerInMatch = matchDetails.players.find(
            (player) => player.account_id === PLAYER_ID
         );

         if (!playerInMatch) {
            console.log(
               `⚠️ Игрок ${PLAYER_ID} не найден в матче ${match.match_id}`
            );
            return;
         }

         // Получаем имя героя
         const heroName = this.getHeroName(playerInMatch.hero_id);

         // Добавляем героя в список, если его там еще нет
         if (!this.autoBannedHeroes.includes(heroName)) {
            this.autoBannedHeroes.push(heroName);
            console.log(
               `✅ Добавлен новый герой: ${heroName} (из матча ${match.match_id})`
            );
         } else {
            console.log(`ℹ️ Герой ${heroName} уже в списке`);
         }
      } catch (error) {
         console.error(
            `❌ Ошибка при обработке матча ${match.match_id}:`,
            error
         );
      }
   }

   // Запуск периодической проверки
   startPeriodicCheck() {
      if (this.isRunning) {
         console.log("⚠️ Периодическая проверка уже запущена");
         return;
      }

      this.isRunning = true;
      const intervalMs = CHECK_INTERVAL_MINUTES * 60 * 1000;

      console.log(
         `⏰ Запуск периодической проверки каждые ${CHECK_INTERVAL_MINUTES} минут`
      );

      this.intervalId = setInterval(async () => {
         console.log("🔄 Выполнение периодической проверки...");
         await this.checkForNewMatches();
      }, intervalMs);
   }

   // Остановка периодической проверки
   stopPeriodicCheck() {
      if (this.intervalId) {
         clearInterval(this.intervalId);
         this.intervalId = null;
         this.isRunning = false;
         console.log("⏹️ Периодическая проверка остановлена");
      }
   }

   // Получение текущего списка автоматически забаненных героев
   getAutoBannedHeroes() {
      return this.autoBannedHeroes;
   }

   // Очистка списка автоматически забаненных героев
   clearAutoBannedHeroes() {
      this.autoBannedHeroes = [];
      this.saveAutoBannedHeroes();
      console.log("🗑️ Список автоматически забаненных героев очищен");
   }
}

// Создание глобального экземпляра трекера
const autoHeroTracker = new AutoHeroTracker();

// Экспорт для использования в других файлах
window.autoHeroTracker = autoHeroTracker;

// Автоматический запуск при загрузке страницы
document.addEventListener("DOMContentLoaded", async () => {
   console.log("🎮 AutoHeroTracker загружается...");
   await autoHeroTracker.init();

   // Выводим текущий список в консоль
   const heroes = autoHeroTracker.getAutoBannedHeroes();
   console.log(
      "🎯 Автоматически забаненные герои (с матча 8316568444):",
      heroes
   );
   console.log("📊 Всего героев в списке:", heroes.length);
});

// Функции для ручного управления (можно вызывать из консоли)
window.manualCheck = () => autoHeroTracker.checkForNewMatches();
window.getAutoBannedHeroes = () => autoHeroTracker.getAutoBannedHeroes();
window.clearAutoBannedHeroes = () => autoHeroTracker.clearAutoBannedHeroes();
window.stopAutoCheck = () => autoHeroTracker.stopPeriodicCheck();
window.startAutoCheck = () => autoHeroTracker.startPeriodicCheck();

// Новая эффективная функция для обработки всех матчей
window.processAllMatchesEfficiently = () =>
   autoHeroTracker.processAllMatchesEfficiently();

// Функция для экспорта данных из localStorage
window.exportAutoBannedData = () => {
   const data = localStorage.getItem("autoBannedHeroes");
   if (data) {
      console.log("📄 Данные из localStorage:");
      console.log(JSON.parse(data));
   } else {
      console.log("📭 Данные в localStorage не найдены");
   }
};

// Функция для очистки localStorage
window.clearLocalStorage = () => {
   localStorage.removeItem("autoBannedHeroes");
   console.log("🗑️ localStorage очищен");
};
