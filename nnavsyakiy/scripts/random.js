export let currentRandomHero = Object;

function filterSelectedHeroes(heroesList) {
   return heroesList.filter(hero => hero.selected === true);
}

export function getRandomHero(heroesArray) {
   const selectableHeroes = filterSelectedHeroes(heroesArray);
   
   if (selectableHeroes.length === 0) {
       console.warn("Нет доступных героев для выбора!");
       return null;
   }

   const randomIndex = Math.floor(Math.random() * selectableHeroes.length);
   return selectableHeroes[randomIndex]; // Теперь возвращаем имя героя
}

export function logHero(hero) {
   console.log("Выбранный герой:", hero.name);
}

export function chooseRandomHero(heroesArray) {
   const randomHero = getRandomHero(heroesArray);

   if (!randomHero) {
      console.warn("Герой не найден!");
      return;
   }

   logHero(randomHero);
   currentRandomHero = randomHero; // Теперь запоминаем только имя героя
}
