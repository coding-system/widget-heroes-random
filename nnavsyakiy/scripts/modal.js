import { portraitsList, saveStartHeroesToLocalStorage } from "../index.js";
import {
   inputElement,
   searchHeroes,
   resetSearch,
} from "./portraits.js";

// Функция для открытия попапа
function openPopup(popup) {
   popup.classList.add("popup_is-opened");
   document.addEventListener("keydown", handleEscKey);
}

// Функция для закрытия попапа
function closePopup(popup) {
   popup.classList.remove("popup_is-opened");
   document.removeEventListener("keydown", handleEscKey);

   // Проверяем, если закрываемый попап — это portraitsList
   if (popup === portraitsList) {
      // saveStartHeroesToLocalStorage(); // Сохраняем массив startHeroes в localStorage

      // Очищаем инпут
      inputElement.value = ""; // Очищаем значение инпута

      // Вызываем searchHeroes для обновления состояния
      setTimeout(() => resetSearch(), 300);
      // searchHeroes(); // Обновляем состояния overlayz
   }
}

// function closePopup(popup) {
//    popup.classList.remove("popup_is-opened");
//    document.removeEventListener("keydown", handleEscKey);

//    // Проверяем, если закрываемый попап — это portraitsList
//    if (popup === portraitsList) {
//       saveStartHeroesToLocalStorage(); // Сохраняем массив startHeroes в localStorage
//    }
// }

// Закрытие попапа по нажатию на клавишу Esc
// Обработчик нажатия клавиши Esc
function handleEscKey(event) {
   if (event.key === "Escape") {
      const openedPopup = document.querySelector(".popup_is-opened");
      if (openedPopup) {
         closePopup(openedPopup);
      }
   }
}

// Функция для инициализации попапов
function initializePopups(onClose) {
   // Добавляем обработчики

   // Получаем все попапы
   // Получаем все попапы
   const popups = document.querySelectorAll(".popup");
   // popups.forEach((popup) => {
   //    popup.classList.add("popup_is-animated");
   // });

   // Закрытие попапа по кнопке закрытия
   popups.forEach((popup) => {
      const closeButton = popup.querySelector(".close__button");
      if (closeButton) {
         closeButton.addEventListener("click", () => {
            onClose(popup);
         });
      }
   });

   // Закрытие попапа при клике на оверлей
   // document.addEventListener("mousedown", (event) => {
   //    if (event.target.classList.contains("popup_is-opened")) {
   //       onClose(event.target);
   //    }
   // });
   let isMouseDown = false;

   document.addEventListener("mousedown", (event) => {
      if (event.target.classList.contains("popup_is-opened")) {
         isMouseDown = true;
      }
   });

   document.addEventListener("mouseup", (event) => {
      if (isMouseDown && event.target.classList.contains("popup_is-opened")) {
         onClose(event.target);
      }
      isMouseDown = false;
   });
}

initializePopups(closePopup);

export { initializePopups, openPopup, closePopup, handleEscKey };
