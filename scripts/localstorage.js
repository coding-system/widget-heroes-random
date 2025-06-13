import { updateRollingSettings } from "./rolling.js";

const durationInput = document.querySelector("#roll-duration-range");
const durationText = document.querySelector(".animation-duration-text");

const hidingsCountInput = document.querySelector("#hidings-count-range");
const hidingsCountText = document.querySelector(".hidings-count-text");

let totalAnimationDuration = 5500;
let totalHidingsCount = 30;

// Функция для загрузки значения из localStorage при старте
export function loadDurationFromStorage() {
   const savedValue = localStorage.getItem("totalAnimationDuration");
   if (savedValue !== null) {
      totalAnimationDuration = Number(savedValue);
      // Устанавливаем значение ползунка, деля на 1000, так как отображаем в секундах
      durationInput.value = totalAnimationDuration / 1000;
   }
   // Устанавливаем начальное значение текста
   durationText.textContent = `${durationInput.value} сек.`;
}

// Функция для сохранения в localStorage
function saveDurationToStorage() {
   localStorage.setItem("totalAnimationDuration", totalAnimationDuration);
}

// Функция для установки значения totalAnimationDuration
export function setTotalAnimationDuration(value) {
   totalAnimationDuration = value;
   saveDurationToStorage();
   updateRollingSettings(); // Обновляем настройки в rolling.js
}

// Добавляем слушатель события на изменение значения ползунка
durationInput.addEventListener("input", function (e) {
   // Получаем текущее значение ползунка
   const currentValue = e.target.value;

   // Обновляем текст в span
   durationText.textContent = `${currentValue} сек.`;

   // Обновляем значение
   setTotalAnimationDuration(currentValue * 1000);
});

// Устанавливаем начальное значение текста
durationText.textContent = durationInput.value;

// Функция для загрузки значения из localStorage при старте
export function loadHidingsCountFromStorage() {
   const savedValue = localStorage.getItem("totalHidingsCount");
   if (savedValue !== null) {
      totalHidingsCount = Number(savedValue);
      hidingsCountInput.value = totalHidingsCount;
   }
   // Устанавливаем начальное значение текста
   hidingsCountText.textContent = hidingsCountInput.value;
}

// Функция для сохранения в localStorage
function saveHidingsCountToStorage() {
   localStorage.setItem("totalHidingsCount", totalHidingsCount);
}

// Функция для установки значения totalHidingsCount
export function setTotalHidingsCount(value) {
   totalHidingsCount = Number(value);
   saveHidingsCountToStorage();
   updateRollingSettings(); // Обновляем настройки в rolling.js
}

// Добавляем слушатель события на изменение значения ползунка
hidingsCountInput.addEventListener("input", function (e) {
   // Получаем текущее значение ползунка
   const currentValue = e.target.value;

   // Обновляем текст в span
   hidingsCountText.textContent = currentValue;

   // Обновляем значение
   setTotalHidingsCount(currentValue);
});

// Функции-геттеры для получения актуальных значений
export function getTotalAnimationDuration() {
   return totalAnimationDuration;
}

export function getTotalHidingsCount() {
   return totalHidingsCount;
}

// Устанавливаем начальное значение текста
hidingsCountText.textContent = hidingsCountInput.value;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const durationInput = document.querySelector("#roll-duration-range");
// const durationText = document.querySelector(".animation-duration-text");

// const hidingsCountInput = document.querySelector("#hidings-count-range");
// const hidingsCountText = document.querySelector(".hidings-count-text");

// export let TOTAL_ANIMATION_DURATION = 5500;
// export let TOTAL_HIDINGS_COUNT = 30;

// // Функция для загрузки значения из localStorage при старте
// export function loadDurationFromStorage() {
//    const savedValue = localStorage.getItem("totalAnimationDuration");
//    if (savedValue !== null) {
//       TOTAL_ANIMATION_DURATION = Number(savedValue);
//       // Устанавливаем значение ползунка, деля на 1000, так как отображаем в секундах
//       durationInput.value = TOTAL_ANIMATION_DURATION / 1000;
//    }
//    // Устанавливаем начальное значение текста
//    durationText.textContent = `${durationInput.value} сек.`;
// }

// // Функция для сохранения в localStorage
// function saveDurationToStorage() {
//    localStorage.setItem("totalAnimationDuration", TOTAL_ANIMATION_DURATION);
// }

// // Добавляем слушатель события на изменение значения ползунка
// durationInput.addEventListener("input", function (e) {
//    // Получаем текущее значение ползунка
//    const currentValue = e.target.value;

//    // Обновляем текст в span
//    durationText.textContent = `${currentValue} сек.`;

//    // Обновляем глобальную переменную
//    TOTAL_ANIMATION_DURATION = currentValue * 1000;

//    // Опционально: можно добавить console.log для отладки
//    // console.log('Current TOTAL_ANIMATION_DURATION:', TOTAL_ANIMATION_DURATION);

//    saveDurationToStorage();
// });

// // Устанавливаем начальное значение текста
// durationText.textContent = durationInput.value;

// loadDurationFromStorage();

// // Функция для загрузки значения из localStorage при старте
// export function loadHidingsCountFromStorage() {
//    const savedValue = localStorage.getItem("totalHidingsCount");
//    if (savedValue !== null) {
//       TOTAL_HIDINGS_COUNT = Number(savedValue);
//       hidingsCountInput.value = TOTAL_HIDINGS_COUNT;
//    }
//    // Устанавливаем начальное значение текста
//    hidingsCountText.textContent = hidingsCountInput.value;
// }

// // Функция для сохранения в localStorage
// function saveHidingsCountToStorage() {
//    localStorage.setItem("totalHidingsCount", TOTAL_HIDINGS_COUNT);
// }

// // Добавляем слушатель события на изменение значения ползунка
// hidingsCountInput.addEventListener("input", function (e) {
//    // Получаем текущее значение ползунка
//    const currentValue = e.target.value;

//    // Обновляем текст в span
//    hidingsCountText.textContent = currentValue;

//    // Обновляем глобальную переменную
//    TOTAL_HIDINGS_COUNT = Number(currentValue);

//    // Опционально: можно добавить console.log для отладки
//    // console.log('Current TOTAL_HIDINGS_COUNT:', TOTAL_HIDINGS_COUNT);

//    saveHidingsCountToStorage();
// });

// // Функции-геттеры для получения актуальных значений
// export function getTotalAnimationDuration() {
//    return totalAnimationDuration;
// }

// export function getTotalHidingsCount() {
//    return totalHidingsCount;
// }

// // Устанавливаем начальное значение текста
// hidingsCountText.textContent = hidingsCountInput.value;

// loadHidingsCountFromStorage();
