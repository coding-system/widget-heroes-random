// portraits.js

import { currentHeroesList } from "../index.js";

const heroesStrengthList = document.querySelector("#heroes-strength");
const heroesAgilityList = document.querySelector("#heroes-agility");
const heroesIntelligenceList = document.querySelector("#heroes-intelligence");
const heroesUniversalList = document.querySelector("#heroes-universal");
export const heroesContainer = document.querySelector(".heroes");
const template = document.querySelector("#card-hero-template");

export function saveHeroesToLocalStorage(heroes) {
   try {
      localStorage.setItem("heroesData", JSON.stringify(heroes));
   } catch (error) {
      console.error("Ошибка при сохранении героев:", error);
   }
}

export function loadHeroesFromLocalStorage() {
   try {
      const data = localStorage.getItem("heroesData");
      return data ? JSON.parse(data) : null;
   } catch (error) {
      console.error("Ошибка при загрузке героев:", error);
      return null;
   }
}

export function renderHeroes(heroes) {
   console.log("Rendering heroes...");

   heroes.sort((a, b) => a.name.localeCompare(b.name));

   const lists = {
      strength: heroesStrengthList,
      agility: heroesAgilityList,
      intelligence: heroesIntelligenceList,
      universal: heroesUniversalList,
   };

   Object.values(lists).forEach((list) => (list.innerHTML = ""));

   heroes.forEach((hero) => {
      const card = template.content
         .cloneNode(true)
         .querySelector(".heroes__item");
      const heroImage = card.querySelector(".heroes__image");
      const bannedOverlay = card.querySelector(".banned-overlay");

      const heroName = hero.image.replace(".jpg", "");
      // heroImage.src = `./assets/heroes/pictures/npc_dota_hero_${heroName}.jpg`;
      heroImage.src = `./assets/heroes/pictures/${heroName}.jpg`;
      heroImage.alt = `Портрет героя: ${hero.name}`;
      card.setAttribute("data-hero-name", hero.name);

      updateHeroDisplay(hero, card, heroImage, bannedOverlay);
      lists[hero.attribute]?.appendChild(card);
   });

   heroesContainer.addEventListener("click", (event) => {
      const heroCard = event.target.closest(".heroes__item");
      if (!heroCard) return;

      const heroName = heroCard.getAttribute("data-hero-name");
      const hero = heroes.find((h) => h.name === heroName);

      if (hero) {
         hero.selected = !hero.selected;
         saveHeroesToLocalStorage(heroes);
         updatePortraits(heroes);
         console.log(
            `${hero.name} теперь ${hero.selected ? "выбран" : "забанен"}`
         );
      }
   });
}

export function updatePortraits(heroes) {
   heroes.forEach((hero) => {
      const heroCard = document.querySelector(
         `.heroes__item[data-hero-name="${hero.name}"]`
      );

      if (heroCard) {
         const heroImage = heroCard.querySelector(".heroes__image");
         const bannedOverlay = heroCard.querySelector(".banned-overlay");
         updateHeroDisplay(hero, heroCard, heroImage, bannedOverlay);
      }
   });
}

export function updateAllHeroes(heroes, banAll = true) {
   heroes.forEach((hero) => {
      hero.selected = banAll;
   });

   saveHeroesToLocalStorage(heroes);
   updatePortraits(heroes);
}

export function updateHeroDisplay(hero, card, image, overlay) {
   if (hero.selected) {
      image.classList.remove("heroes__image-banned");
      overlay.classList.remove("banned-overlay-banned");
      card.classList.remove("heroes__item-banned");
   } else {
      image.classList.add("heroes__image-banned");
      overlay.classList.add("banned-overlay-banned");
      card.classList.add("heroes__item-banned");
   }
}
