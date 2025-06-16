export const projectName = "golast";
import {
   renderHeroes,
   saveHeroesToLocalStorage,
   loadHeroesFromLocalStorage,
   updateAllHeroes,
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
} from "./scripts/rolling.js";

import {
   // TOTAL_ANIMATION_DURATION,
   // TOTAL_HIDINGS_COUNT,
   loadDurationFromStorage,
   loadHidingsCountFromStorage,
} from "./scripts/localstorage.js";
// import { hints, createHint, initHints, showHint } from "./scripts/hints.js";
import {
   loadBannedHistory,
   createChellangeHeroes,
} from "./scripts/bannedHistory.js";

export let currentHeroesList = [];
export let playedHeroesList = [];

// Загружаем героев при старте
window.addEventListener("DOMContentLoaded", async () => {
   const loadedHeroes = loadHeroesFromLocalStorage();
   if (loadedHeroes) {
      currentHeroesList = loadedHeroes;
   } else {
      currentHeroesList = JSON.parse(JSON.stringify(startHeroes));
      saveHeroesToLocalStorage(currentHeroesList);
   }
   renderHeroes(currentHeroesList);
   showPageBody(200);

   // Загружаем playedHeroesList из bannedHistory.json
   playedHeroesList = await loadBannedHistory();
   console.log("Загруженный список сыгранных героев:", playedHeroesList);
});

export const startHeroes = JSON.parse(JSON.stringify(initialHeroes));

console.log(startHeroes);

// Переменная для хранения последнего выбранного элемента
let lastChosenItem = null;
// export let currentRandomHero;
const pageBody = document.querySelector(".body");
export const navPanel = document.querySelector(".nav-panel");
const goBtn = document.querySelector(".go-button");
const banAllButton = document.querySelector(".unban-all-button");
const unbanAllButton = document.querySelector(".ban-all-button");
const resetButton = document.querySelector(".reset-button");
const historyButton = document.querySelector(".history-button");

// Обработчик клика по кнопке "Roll"
goBtn.addEventListener("click", () => {
   chooseRandomHero(currentHeroesList);
   runAnimation(currentHeroesList);
});

banAllButton.addEventListener("click", () => {
   updateAllHeroes(currentHeroesList, true);
   console.log("Все герои забанены");
});

unbanAllButton.addEventListener("click", () => {
   updateAllHeroes(currentHeroesList, false);
   console.log("Все герои разбанены");
});
resetButton.addEventListener("click", () => {
   resetLocalStorage();
   updateAllHeroes(currentHeroesList, true);
   console.log("Все данные сброшены");
});

historyButton.addEventListener("click", () => {
   const chellangeHeroes = createChellangeHeroes(startHeroes, playedHeroesList);
   currentHeroesList = chellangeHeroes;
   saveHeroesToLocalStorage(currentHeroesList);
   renderHeroes(currentHeroesList); // Перерисовываем все карточки
   console.log("Применены баны из истории");
});

document.addEventListener("keyup", handleKeyPressRoll);

document.addEventListener("keyup", function (event) {
   const key = event.key.toLowerCase();
   if (key === "w" || key === "ц") {
      navPanel.classList.toggle("nav-panel-visible");
      if (!pageBody.classList.contains("body-visible")) {
         pageBody.classList.add("body-visible");
      }
   }
});

document.addEventListener("keyup", function (event) {
   const key = event.key.toLowerCase();
   if (key === "f" || key === "а") {
      pageBody.classList.toggle("body-visible");
   }
});

// document.addEventListener("DOMContentLoaded", initHints);

function resetLocalStorage() {
   localStorage.clear();
   console.log("Весь localStorage очищен!");
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
   }
}

loadHidingsCountFromStorage();
loadDurationFromStorage();

// console.log(TOTAL_ANIMATION_DURATION)

// console.log(TOTAL_ANIMATION_DURATION)
