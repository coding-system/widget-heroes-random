export const projectName = "golast";
import {
   renderHeroes,
   saveHeroesToLocalStorage,
   loadHeroesFromLocalStorage,
   updateAllHeroes,
   updatePortraits,
} from "./scripts/portraits.js";
import { initialHeroes } from "./scripts/heroes.js";
import { lastHeroes } from "./scripts/lastheroes.js";
import {
   currentRandomHero,
   chooseRandomHero,
   getRandomHero,
} from "./scripts/random.js";
import {
   globalOverlay,
   runAnimation,
   reroll,
   acceptChosenHero,
   resetRollStyles,
   handleKeyPressRoll,
   resetHidePageTimer,
} from "./scripts/rolling.js";

import {
   // TOTAL_ANIMATION_DURATION,
   // TOTAL_HIDINGS_COUNT,
   loadDurationFromStorage,
   loadHidingsCountFromStorage,
} from "./scripts/localstorage.js";
// import { hints, createHint, initHints, showHint } from "./scripts/hints.js";
import { createChellangeHeroes } from "./scripts/bannedHistory.js";

export let currentHeroesList = [];
export let playedHeroesList = [];
export const startHeroes = JSON.parse(JSON.stringify(initialHeroes));

// Загружаем героев при старте
window.addEventListener("DOMContentLoaded", async () => {
   const loadedHeroes = loadHeroesFromLocalStorage();
   if (loadedHeroes) {
      currentHeroesList = loadedHeroes;
   } else {
      currentHeroesList = startHeroes;
      saveHeroesToLocalStorage(currentHeroesList);
   }
   renderHeroes(currentHeroesList);
   showPageBody(200);

   // Ждем инициализации autoHeroTracker и загружаем автоматически забаненных героев
   // playedHeroesList теперь будет содержать автоматически забаненных героев
   setTimeout(async () => {
      if (window.autoHeroTracker) {
         playedHeroesList = window.autoHeroTracker.getAutoBannedHeroes();
         console.log(
            "Загруженный список автоматически забаненных героев:",
            playedHeroesList
         );
      } else {
         console.log(
            "AutoHeroTracker еще не инициализирован, используем пустой список"
         );
         playedHeroesList = [];
      }
   }, 1000); // Даем время на инициализацию autoHeroTracker
});

console.log(startHeroes);

// Переменная для хранения последнего выбранного элемента
let lastChosenItem = null;
// export let currentRandomHero;
const pageBody = document.querySelector(".body");
export const navPanel = document.querySelector(".nav-panel");
const goBtn = document.querySelector(".go-button");
const banAllButton = document.querySelector(".ban-all-button");
const unbanAllButton = document.querySelector(".unban-all-button");
const resetButton = document.querySelector(".reset-button");
const historyButton = document.querySelector(".history-button");

// Обработчик клика по кнопке "Roll"
goBtn.addEventListener("click", () => {
   chooseRandomHero(currentHeroesList);
   runAnimation(currentHeroesList);
   resetHidePageTimer();
});

banAllButton.addEventListener("click", () => {
   updateAllHeroes(currentHeroesList, false);
   resetHidePageTimer();
   console.log("Все герои забанены");
});

unbanAllButton.addEventListener("click", () => {
   updateAllHeroes(currentHeroesList, true);
   resetHidePageTimer();
   console.log("Все герои разбанены");
});
resetButton.addEventListener("click", () => {
   resetLocalStorage();
   updateAllHeroes(currentHeroesList, true);
   resetHidePageTimer();
   console.log("Все данные сброшены");
});

historyButton.addEventListener("click", () => {
   // Применяем баны из автоматически забаненных героев
   applyAutoBannedHeroes();
});

document.addEventListener("keyup", handleKeyPressRoll);

document.addEventListener("keyup", function (event) {
   const key = event.key.toLowerCase();
   if (key === "w" || key === "ц") {
      navPanel.classList.toggle("nav-panel-visible");
      if (!pageBody.classList.contains("body-visible")) {
         pageBody.classList.add("body-visible");
      }
      resetHidePageTimer();
   }
});

document.addEventListener("keyup", function (event) {
   const key = event.key.toLowerCase();
   if (key === "f" || key === "а") {
      pageBody.classList.toggle("body-visible");
      resetHidePageTimer();
   }
});

function resetLocalStorage() {
   localStorage.clear();
   currentHeroesList = JSON.parse(JSON.stringify(startHeroes));
   saveHeroesToLocalStorage(currentHeroesList);

   // Обновляем START_MATCH_ID на ID последнего матча
   if (window.autoHeroTracker) {
      window.autoHeroTracker
         .updateStartMatchIdToLatest()
         .then(async (success) => {
            if (success) {
               const newStartMatchId = window.autoHeroTracker.getStartMatchId();
               if (window.autoHeroTracker.updateInputField) {
                  window.autoHeroTracker.updateInputField(newStartMatchId);
               }
               // Очищаем autoBannedHeroes и сразу применяем сыгранных героев
               window.autoHeroTracker.autoBannedHeroes = [];
               await window.autoHeroTracker.saveAutoBannedHeroes();
               await window.autoHeroTracker.checkForNewMatches();
               console.log(
                  "✅ START_MATCH_ID обновлен на последний матч и сыгранные герои применены"
               );
            } else {
               if (window.autoHeroTracker.updateInputField) {
                  window.autoHeroTracker.updateInputField("");
               }
               console.log("❌ Не удалось обновить START_MATCH_ID");
            }
         });
   }

   console.log(
      "Весь localStorage очищен и герои сброшены к начальному состоянию!"
   );
}

let timeoutId = null; // Переменная для хранения ID таймаута

export function showPageBody(delay = 0) {
   if (timeoutId) {
      clearTimeout(timeoutId); // Отменяем предыдущий таймаут, если он существует
   }
   if (delay > 0) {
      timeoutId = setTimeout(() => {
         pageBody.classList.add("body-visible");
         timeoutId = null; // Очищаем ID после выполнения
      }, delay);
   } else {
      pageBody.classList.add("body-visible");
   }
}

export function hidePageBody(delay = 0) {
   if (timeoutId) {
      clearTimeout(timeoutId); // Отменяем предыдущий таймаут, если он существует
   }
   if (delay > 0) {
      timeoutId = setTimeout(() => {
         pageBody.classList.remove("body-visible");
         timeoutId = null; // Очищаем ID после выполнения
      }, delay);
   } else {
      pageBody.classList.remove("body-visible");
      navPanel.classList.remove("nav-panel-visible");
   }
}

loadHidingsCountFromStorage();
loadDurationFromStorage();

// Функция для обновления списка автоматически забаненных героев
export function updateAutoBannedHeroesList() {
   if (window.autoHeroTracker) {
      playedHeroesList = window.autoHeroTracker.getAutoBannedHeroes();
      console.log(
         "📋 Список автоматически забаненных героев обновлен:",
         playedHeroesList
      );
      return playedHeroesList;
   } else {
      console.log("❌ AutoHeroTracker не доступен");
      return [];
   }
}

// Функция для принудительного применения банов из автоматически забаненных героев
export function applyAutoBannedHeroes() {
   // Обновляем список автоматически забаненных героев
   const currentAutoBannedHeroes = updateAutoBannedHeroesList();

   // Применяем баны
   const chellangeHeroes = createChellangeHeroes(
      startHeroes,
      currentAutoBannedHeroes
   );
   currentHeroesList = chellangeHeroes;
   saveHeroesToLocalStorage(currentHeroesList);
   updatePortraits(currentHeroesList);
   resetHidePageTimer();

   console.log("✅ Применены баны из автоматически забаненных героев");
   console.log(`📊 Забаннено героев: ${currentAutoBannedHeroes.length}`);

   return currentAutoBannedHeroes;
}

// Экспортируем функцию для получения информации о текущем состоянии
export function getSystemInfo() {
   const info = {
      startMatchId: window.autoHeroTracker
         ? window.autoHeroTracker.getStartMatchId()
         : "Недоступен",
      autoBannedHeroesCount: window.autoHeroTracker
         ? window.autoHeroTracker.getAutoBannedHeroes().length
         : 0,
      currentHeroesCount: currentHeroesList.length,
      playerId: 1892794016,
   };

   console.log("📊 Информация о системе:", info);
   return info;
}

// Экспортируем функцию в window для использования в консоли
window.getSystemInfo = getSystemInfo;

// Экспортируем функцию в window для использования в консоли
window.applyAutoBannedHeroes = applyAutoBannedHeroes;

// Экспортируем функцию в window для использования в консоли
window.updateAutoBannedHeroesList = updateAutoBannedHeroesList;

console.log(startHeroes);
