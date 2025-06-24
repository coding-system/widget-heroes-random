import { currentRandomHero, chooseRandomHero } from "./random.js";
import {
   saveHeroesToLocalStorage,
   updatePortraits,
   heroesContainer,
   updateHeroDisplay,
} from "./portraits.js";
import {
   currentHeroesList,
   hidePageBody,
   showPageBody,
   navPanel,
} from "../index.js";
import {
   getTotalAnimationDuration,
   getTotalHidingsCount,
} from "./localstorage.js";
// Объявляем переменные в начале файла (используем let, чтобы можно было обновлять)
let TOTAL_ANIMATION_DURATION = getTotalAnimationDuration();
let HIDINGS_COUNT = getTotalHidingsCount();
const HIDE_PAGE_DELAY = 4000;
const AFK_ACCEPT_HERO_DELAY = 30000;
const FIXED_HEROES_SEQUENCE = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // Последние 10 скрытий
let FIXED_PHASES_START = HIDINGS_COUNT - FIXED_HEROES_SEQUENCE.length + 1;
const MIN_DURATION = 5;
let EXTRA_DURATION = TOTAL_ANIMATION_DURATION / 5;
const EXTRA_MIN_DURATION = 10;

let hidePageTimeoutId = null;
let acceptHeroTimeoutId = null;
let phaseData = []; // Массив для хранения объектов { duration, heroesPerStep }

// Функция для сброса и перезапуска таймера скрытия страницы
export function resetHidePageTimer() {
   if (hidePageTimeoutId) {
      clearTimeout(hidePageTimeoutId);
   }
   hidePageTimeoutId = setTimeout(() => hidePageBody(0), HIDE_PAGE_DELAY);
}

// Функция для обновления настроек
export function updateRollingSettings() {
   TOTAL_ANIMATION_DURATION = getTotalAnimationDuration();
   HIDINGS_COUNT = getTotalHidingsCount();
   FIXED_PHASES_START = HIDINGS_COUNT - FIXED_HEROES_SEQUENCE.length + 1;
   EXTRA_DURATION = TOTAL_ANIMATION_DURATION / 5;
   console.log("Настройки анимации обновлены:", {
      TOTAL_ANIMATION_DURATION,
      HIDINGS_COUNT,
      FIXED_PHASES_START,
      EXTRA_DURATION,
   });
}

export const globalOverlay = document.querySelector(".global-overlay");
export const heroInfo = document.querySelector(".hero-info");
export const heroInfoBackground = heroInfo?.querySelector(
   ".hero-info__background"
);
export const heroInfoLoadout = heroInfo?.querySelector(".hero-info__loadout");
export const heroInfoTitle = heroInfo?.querySelector(".hero-info__title");
export const heroInfoVideo = heroInfo?.querySelector(".hero-info__video");
export const videoSources = heroInfoVideo?.querySelectorAll("source");

const flippedHeroes = [
   "Dawnbreaker",
   "Huskar",
   "Lycan",
   "Mars",
   "Night Stalker",
   "Ogre Magi",
   "Tidehunter",
   "Antimage",
   "Gyrocopter",
   "Hoodwink",
   "Kez",
   "Medusa",
   "Sniper",
   "Vengeful Spirit",
   "Chen",
   "Invoker",
   "Ringmaster",
   "Silencer",
   "Dazzle",
   "Magnus",
];

export function toggleGlobalOverlayDisabled(action) {
   if (globalOverlay && ["add", "remove"].includes(action)) {
      globalOverlay.classList[action]("global-overlay-visible");
   }
}

export function disableHeroCards() {
   heroesContainer.classList.add("heroes-disabled");
}

export function toggleHeroCardsDisabled(action) {
   if (heroesContainer && ["add", "remove"].includes(action)) {
      heroesContainer.classList[action]("heroes-disabled");
   }
}

export function markHeroes(heroesArray) {
   heroesArray.forEach((hero) => {
      const heroElement = document.querySelector(
         `.heroes__item[data-hero-name="${hero.name}"]`
      );
      if (!heroElement) return;

      const heroImage = heroElement.querySelector(".heroes__image");
      const bannedOverlay = heroElement.querySelector(".banned-overlay");
      if (!heroImage || !bannedOverlay) return;

      heroElement.classList.remove(
         "heroes__item-involved",
         "heroes__item-not-involved",
         "heroes__item-retired"
      );
      heroImage.classList.remove(
         "heroes__image-involved",
         "heroes__image-not-involved",
         "heroes__image-retired"
      );
      bannedOverlay.classList.remove(
         "banned-overlay-banned",
         "banned-overlay-invisible"
      );

      if (hero.selected) {
         heroElement.classList.add("heroes__item-involved");
         heroImage.classList.add("heroes__image-involved");
      } else {
         heroElement.classList.add("heroes__item-not-involved");
         heroImage.classList.add("heroes__image-not-involved");
         bannedOverlay.classList.add("banned-overlay-invisible");
      }
   });
}

export function highlightFinalHero() {
   if (!currentRandomHero.name) return;

   const heroElement = document.querySelector(
      `.heroes__item[data-hero-name="${currentRandomHero.name}"]`
   );
   if (!heroElement) return;

   const heroImage = heroElement.querySelector(".heroes__image");
   heroElement.classList.add("heroes__item-final");
   heroImage.classList.add("heroes__image-final");

   showHeroInfoElements();

   document.addEventListener("keyup", handleKeyPressOptions);

   resetHidePageTimer();
   acceptHeroTimeoutId = setTimeout(() => {
      acceptChosenHero();
      resetRollStyles();
      document.removeEventListener("keyup", handleKeyPressOptions);
      document.addEventListener("keyup", handleKeyPressRoll);
   }, AFK_ACCEPT_HERO_DELAY);
}

function handleKeyPressOptions(event) {
   const key = event.key.toLowerCase();
   if (key === "ф" || key === "a") {
      clearTimeout(hidePageTimeoutId);
      clearTimeout(acceptHeroTimeoutId);
      acceptChosenHero();
      resetRollStyles();
      document.removeEventListener("keyup", handleKeyPressOptions);
      document.addEventListener("keyup", handleKeyPressRoll);
   } else if (key === "к" || key === "r") {
      clearTimeout(hidePageTimeoutId);
      clearTimeout(acceptHeroTimeoutId);
      reroll();
      document.removeEventListener("keyup", handleKeyPressOptions);
   }
}

export function handleKeyPressRoll(event) {
   const key = event.key.toLowerCase();
   if (key === "s" || key === "ы") {
      chooseRandomHero(currentHeroesList);
      runAnimation(currentHeroesList);
      document.removeEventListener("keyup", handleKeyPressRoll);
   }
}

export function resetRollStyles() {
   const finalHeroElement = document.querySelector(".heroes__item-final");
   if (finalHeroElement) {
      finalHeroElement.classList.remove("heroes__item-final");
      const finalHeroImage = finalHeroElement.querySelector(".heroes__image");
      if (finalHeroImage)
         finalHeroImage.classList.remove("heroes__image-final");
   }

   const allHeroes = document.querySelectorAll(".heroes__item");
   allHeroes.forEach((heroElement) => {
      heroElement.classList.remove(
         "heroes__item-involved",
         "heroes__item-not-involved",
         "heroes__item-retired"
      );
      const heroImage = heroElement.querySelector(".heroes__image");
      if (heroImage) {
         heroImage.classList.remove(
            "heroes__image-involved",
            "heroes__image-not-involved",
            "heroes__image-retired"
         );
      }
      const bannedOverlay = heroElement.querySelector(".banned-overlay");
      if (bannedOverlay) {
         bannedOverlay.classList.remove("banned-overlay-invisible");
      }
   });
   updatePortraits(currentHeroesList);
   toggleGlobalOverlayDisabled("remove");
   hideHeroInfoElements();
   toggleHeroCardsDisabled("remove");
}

export function updateHeroInfo() {
   if (!currentRandomHero.name || !heroInfo) return;

   if (heroInfoTitle) {
      heroInfoTitle.textContent = currentRandomHero.name;
   }

   if (heroInfoLoadout && currentRandomHero.loadout) {
      heroInfoLoadout.style.backgroundImage = `url("https://widget.cheberem.ru/assets/heroes/loadout/${currentRandomHero.loadout}")`;
   }

   if (heroInfoVideo && videoSources?.length >= 2) {
      heroInfoVideo.poster = `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${currentRandomHero.image.replace(
         ".jpg",
         ""
      )}.png`;
      videoSources[0].src = `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${currentRandomHero.image.replace(
         ".jpg",
         ""
      )}.mov`;
      videoSources[1].src = `https://cdn.akamai.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${currentRandomHero.image.replace(
         ".jpg",
         ""
      )}.webm`;

      if (flippedHeroes.includes(currentRandomHero.name)) {
         heroInfoVideo.classList.add("hero-info__video-flipped");
      } else {
         heroInfoVideo.classList.remove("hero-info__video-flipped");
      }

      heroInfoVideo.load();
      heroInfoVideo.play().catch((error) => {
         console.error("Ошибка воспроизведения видео:", error);
      });
   }
}

export function showHeroInfo() {
   if (heroInfo) {
      heroInfo.classList.add("hero-info-visible");
   }
}

export function showHeroInfoElements() {
   if (heroInfo) {
      heroInfo.classList.add("hero-info-visible");
      heroInfoBackground.classList.add("hero-info__background-visible");
      heroInfoLoadout.classList.add("hero-info__loadout-visible");
      heroInfoTitle.classList.add("hero-info__title-visible");
      heroInfoVideo.classList.add("hero-info__video-visible");
   }
}

export function hideHeroInfoElements() {
   if (heroInfo) {
      heroInfo.classList.remove("hero-info-visible");
      setTimeout(() => {
         heroInfoBackground.classList.remove("hero-info__background-visible");
         heroInfoLoadout.classList.remove("hero-info__loadout-visible");
         heroInfoTitle.classList.remove("hero-info__title-visible");
         heroInfoVideo.classList.remove("hero-info__video-visible");
      }, 500);
   }
}

export function getRandomRotation() {
   return Math.floor(Math.random() * 7) - 3;
}

// export function playSound(file, volume) {
//    const sound = new Audio(`../assets/sounds/${file}`);
//    sound.volume = volume;
//    sound.play().catch((error) => {
//       console.error("Ошибка воспроизведения звука:", error);
//    });
// }

// Функция для генерации фиксированных значений для последних шагов
function generateFixedHeroesPerStep() {
   const fixedHeroesPerStepMap = {};
   const fixedSteps = FIXED_HEROES_SEQUENCE.length;

   for (let i = 0; i < fixedSteps; i++) {
      const step = HIDINGS_COUNT - (fixedSteps - 1) + i;
      fixedHeroesPerStepMap[step] = FIXED_HEROES_SEQUENCE[i];
   }
   return fixedHeroesPerStepMap;
}

// Функция для генерации массива объектов { duration, heroesPerStep }
function generatePhaseData(totalPhases, totalHeroes) {
   const phaseData = new Array(totalPhases);
   const fixedPhases = FIXED_HEROES_SEQUENCE.length;
   const nonFixedPhases = totalPhases - fixedPhases;

   // Шаг 1: Распределяем (TOTAL_ANIMATION_DURATION - EXTRA_DURATION) между всеми фазами
   const baseDuration = TOTAL_ANIMATION_DURATION - EXTRA_DURATION;
   const totalMinDuration = MIN_DURATION * totalPhases; // Сумма минимальных длительностей
   const remainingDuration = baseDuration - totalMinDuration; // Оставшееся время
   const baseIncrement =
      remainingDuration / ((totalPhases * (totalPhases - 1)) / 2); // Базовый шаг увеличения

   let sum = 0;
   for (let i = 0; i < totalPhases; i++) {
      const duration = Math.round(MIN_DURATION + i * baseIncrement);
      phaseData[i] = { duration, heroesPerStep: 0 }; // Инициализируем объект
      sum += duration;
   }

   // Корректировка для точного соответствия (TOTAL_ANIMATION_DURATION - EXTRA_DURATION)
   let difference = baseDuration - sum;
   if (difference !== 0) {
      const lastIndex = totalPhases - 1;
      phaseData[lastIndex].duration += difference; // Добавляем или вычитаем разницу на последнюю фазу
      sum += difference;
   }

   // Шаг 2: Генерируем дополнительные длительности для фиксированных фаз (они должны занять EXTRA_DURATION)
   const totalExtraMinDuration = EXTRA_MIN_DURATION * fixedPhases;
   const remainingExtraDuration = EXTRA_DURATION - totalExtraMinDuration;
   const extraBaseIncrement =
      remainingExtraDuration / ((fixedPhases * (fixedPhases - 1)) / 2);

   let extraSum = 0;
   const extraDurations = new Array(fixedPhases);
   for (let i = 0; i < fixedPhases; i++) {
      extraDurations[i] = Math.round(
         EXTRA_MIN_DURATION + i * extraBaseIncrement
      );
      extraSum += extraDurations[i];
   }

   // Корректировка для точного соответствия EXTRA_DURATION
   difference = EXTRA_DURATION - extraSum;
   if (difference !== 0) {
      const lastExtraIndex = fixedPhases - 1;
      extraDurations[lastExtraIndex] += difference;
      extraSum += difference;
   }

   // Шаг 3: Добавляем дополнительные длительности к фиксированным фазам
   for (let i = 0; i < fixedPhases; i++) {
      const phaseIndex = nonFixedPhases + i;
      phaseData[phaseIndex].duration += extraDurations[i];
      sum += extraDurations[i];
   }

   // Шаг 4: Распределяем героев по фазам
   const fixedHeroesPerStepMap = generateFixedHeroesPerStep();
   const fixedHeroes = FIXED_HEROES_SEQUENCE.reduce((sum, num) => sum + num, 0);
   const heroesForDistribution = Math.max(0, totalHeroes - fixedHeroes - 1); // -1 для финального героя
   const distributionPhases = FIXED_PHASES_START - 1; // Количество пакетов до фиксированных скрытий

   // Распределяем героев по нефиксированным фазам в убывающей прогрессии
   if (distributionPhases > 0 && heroesForDistribution > 0) {
      // Последняя нефиксированная фаза должна иметь столько же героев, сколько первая фиксированная
      const lastNonFixedHeroes = FIXED_HEROES_SEQUENCE[0];

      // Если есть только одна нефиксированная фаза
      if (distributionPhases === 1) {
         phaseData[0].heroesPerStep = heroesForDistribution;
      } else {
         // Вычисляем первый член прогрессии (a1) и разницу (d)
         const a1 =
            (2 * heroesForDistribution) / distributionPhases -
            lastNonFixedHeroes;
         const d = (lastNonFixedHeroes - a1) / (distributionPhases - 1);

         // Заполняем нефиксированные фазы
         let remainingHeroes = heroesForDistribution;
         const tempHeroesPerStep = new Array(distributionPhases);

         // Сначала рассчитываем значения без округления
         for (let i = 0; i < distributionPhases; i++) {
            tempHeroesPerStep[i] = a1 + i * d;
         }

         // Округляем и корректируем, чтобы сумма была точной
         let currentSum = 0;
         for (let i = 0; i < distributionPhases; i++) {
            const roundedValue = Math.round(tempHeroesPerStep[i]);
            tempHeroesPerStep[i] = Math.max(1, roundedValue); // Не допускаем значений меньше 1
            currentSum += tempHeroesPerStep[i];
         }

         // Корректируем значения, чтобы сумма была равна heroesForDistribution
         let difference = heroesForDistribution - currentSum;
         let i = distributionPhases - 1;
         while (difference !== 0 && i >= 0) {
            if (difference > 0) {
               // Если нужно добавить героев
               tempHeroesPerStep[i]++;
               difference--;
            } else if (difference < 0 && tempHeroesPerStep[i] > 1) {
               // Если нужно убрать героев, но не меньше 1
               tempHeroesPerStep[i]--;
               difference++;
            }
            i--;
            if (i < 0) i = distributionPhases - 1; // Циклически проходим, если нужно
         }

         // Присваиваем скорректированные значения
         for (let i = 0; i < distributionPhases; i++) {
            phaseData[i].heroesPerStep = tempHeroesPerStep[i];
            remainingHeroes -= phaseData[i].heroesPerStep;
         }

         // Проверяем, что remainingHeroes равно 0
         if (remainingHeroes !== 0) {
            console.warn(
               `Ошибка: остаток героев после распределения: ${remainingHeroes}`
            );
         }
      }
   }

   // Заполняем фиксированные фазы
   for (let i = distributionPhases; i < totalPhases; i++) {
      const hidingStep = i + 1;
      phaseData[i].heroesPerStep = fixedHeroesPerStepMap[hidingStep] || 0;
   }

   // Проверяем общую сумму длительностей
   const expectedTotalDuration = TOTAL_ANIMATION_DURATION;
   if (sum !== expectedTotalDuration) {
      console.warn(
         `Ошибка: общая сумма длительностей (${sum} мс) не равна ожидаемой (${expectedTotalDuration} мс)`
      );
   }

   return phaseData;
}

// Функция скрытия героев в пакете
export function retireHeroes(heroesArray, heroesPerStep, hidingStep) {
   let activeHeroes = heroesArray
      .filter((hero) => hero.selected && hero.name !== currentRandomHero.name)
      .filter((hero) => {
         const heroElement = document.querySelector(
            `.heroes__item[data-hero-name="${hero.name}"]`
         );
         return (
            heroElement &&
            !heroElement.classList.contains("heroes__item-retired")
         );
      });

   // Если активных героев меньше, чем нужно скрыть, скрываем всех оставшихся
   const heroesToRetireCount = Math.min(heroesPerStep, activeHeroes.length);
   if (heroesToRetireCount <= 0) {
      console.log(`Шаг ${hidingStep}: нет героев для скрытия`);
      return Promise.resolve();
   }

   const shuffle = (array) => array.sort(() => Math.random() - 0.5);
   const heroesToRetire = shuffle(activeHeroes).slice(0, heroesToRetireCount);

   heroesToRetire.forEach((hero) => {
      const heroElement = document.querySelector(
         `.heroes__item[data-hero-name="${hero.name}"]`
      );
      const heroImage = heroElement.querySelector(".heroes__image");
      heroElement.classList.add("heroes__item-retired");
      heroImage.classList.add("heroes__image-retired");
   });

   // Проигрываем звук один раз на пакет
   // playSound("rolling_click.m4a", 0.0025);
   // console.log(`Шаг ${hidingStep}: скрыто ${heroesToRetire.length} героев`);
   return Promise.resolve();
}

// Функция запуска одной фазы скрытия
export async function runPhase(
   heroesArray,
   heroesPerStep,
   duration,
   hidingStep
) {
   await retireHeroes(heroesArray, heroesPerStep, hidingStep);
   // console.log(`Длительность шага ${hidingStep}: ${duration} мс`);
   return new Promise((resolve) => {
      setTimeout(() => {
         resolve();
      }, duration);
   });
}

// Функция запуска финальной фазы
export async function runFinalPhase(duration) {
   return new Promise((resolve) => {
      setTimeout(() => {
         // playSound("rolling_poof.m4a", 0.015);
         highlightFinalHero();
         console.log("Финальная фаза: подсвечен герой", currentRandomHero.name);
         console.log(`Длительность финальной фазы: ${duration} мс`);
         resolve();
      }, duration); // Исправлено: используем duration вместо difference
   });
}

// Функция запуска всех фаз
export async function runAllPhases(heroesArray) {
   let activeHeroes = heroesArray.filter(
      (hero) => hero.selected && hero.name !== currentRandomHero.name
   );
   const totalHeroes = activeHeroes.length + 1; // +1 для финального героя
   if (totalHeroes <= 1 && !currentRandomHero.name) {
      console.log("Нет героев для анимации");
      return;
   }

   const totalPhases = HIDINGS_COUNT; // Количество шагов до полного скрытия всех не финальных героев
   let hidingStep = 1;
   let totalDuration = 0;

   console.log(
      `Всего героев: ${totalHeroes}, пакетов: ${totalPhases}, начальная длительность: ${MIN_DURATION} мс`
   );
   console.log("Массив данных всех фаз (длительность и герои):", phaseData);

   while (hidingStep <= HIDINGS_COUNT) {
      const { heroesPerStep, duration } = phaseData[hidingStep - 1]; // Берем данные из phaseData
      totalDuration += duration;

      // console.log(
      //    `Шаг ${hidingStep}: скрываем ${heroesPerStep} героев, длительность ${duration} мс`
      // );
      await runPhase(heroesArray, heroesPerStep, duration, hidingStep);

      activeHeroes = heroesArray
         .filter(
            (hero) => hero.selected && hero.name !== currentRandomHero.name
         )
         .filter((hero) => {
            const heroElement = document.querySelector(
               `.heroes__item[data-hero-name="${hero.name}"]`
            );
            return (
               heroElement &&
               !heroElement.classList.contains("heroes__item-retired")
            );
         });

      // console.log(
      //    `Шаг ${hidingStep}: осталось активных героев: ${activeHeroes.length}`
      // );

      // Если остался только финальный герой
      if (activeHeroes.length === 0 && currentRandomHero.name) {
         // playSound("rolling_poof.m4a", 0.015);
         highlightFinalHero();
         console.log(
            `Финальный герой подсвечен сразу после шага ${hidingStep}, общая длительность: ${totalDuration} мс`
         );
         break;
      }

      hidingStep++;
   }

   // Запасная проверка, если цикл завершился без подсветки
   if (hidingStep > HIDINGS_COUNT && currentRandomHero.name) {
      const { duration } = phaseData[totalPhases - 1];
      totalDuration += duration;
      await runFinalPhase(duration);
      console.log(
         `Финальный герой подсвечен после всех шагов, общая длительность: ${totalDuration} мс`
      );
   }

   // Проверка точности суммы
   const expectedDuration = TOTAL_ANIMATION_DURATION;
   if (totalDuration !== expectedDuration) {
      console.warn(
         `Ошибка: сумма длительностей (${totalDuration} мс) не равна ожидаемой (${expectedDuration} мс)`
      );
   } else {
      console.log(
         `Сумма длительностей всех фаз: ${totalDuration} мс (точно соответствует ${expectedDuration} мс)`
      );
   }
}

export function runAnimation(heroesArray) {
   if (hidePageTimeoutId) {
      console.log("Отменяем таймер скрытия страницы:", hidePageTimeoutId);
      clearTimeout(hidePageTimeoutId);
      hidePageTimeoutId = null;
   }

   // Вычисляем общее количество героев
   const totalHeroes =
      heroesArray.filter(
         (hero) => hero.selected && hero.name !== currentRandomHero.name
      ).length + 1; // +1 для финального героя

   // Генерируем массив данных (длительность и герои) перед запуском анимации
   phaseData = generatePhaseData(HIDINGS_COUNT, totalHeroes);

   navPanel.classList.remove("nav-panel-visible");
   toggleHeroCardsDisabled("add");
   toggleGlobalOverlayDisabled("add");
   setTimeout(() => {
      updateHeroInfo();
   }, 750);
   markHeroes(heroesArray);
   setTimeout(() => {
      runAllPhases(heroesArray);
   }, 750);
   showPageBody(0);
}

export function deleteChosenHero(chosenHero) {
   if (chosenHero) {
      const heroIndex = currentHeroesList.findIndex(
         (hero) => hero.name === chosenHero.name
      );
      if (heroIndex !== -1) {
         // playSound("rolling_poof.m4a", 0);
         currentHeroesList[heroIndex].selected = false;
         console.log(`Герой ${chosenHero.name} удален из выборки`);
      }
   }
}

export function acceptChosenHero() {
   deleteChosenHero(currentRandomHero);
   const heroElement = document.querySelector(
      `.heroes__item[data-hero-name="${currentRandomHero.name}"]`
   );
   if (heroElement) {
      const heroImage = heroElement.querySelector(".heroes__image");
      const bannedOverlay = heroElement.querySelector(".banned-overlay");
      updateHeroDisplay(
         currentRandomHero,
         heroElement,
         heroImage,
         bannedOverlay
      );
   }
   saveHeroesToLocalStorage(currentHeroesList);
   console.log("Текущий список героев:", currentHeroesList);
   hidePageBody(HIDE_PAGE_DELAY);
}

export function reroll() {
   resetRollStyles();
   chooseRandomHero(currentHeroesList);
   runAnimation(currentHeroesList);
}
