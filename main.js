///////////////// Global Variables /////////////////
let battleList = [];
let selectPokemon = document.querySelector("#selectPokemon");
let chooseBtn = document.querySelector("#choose");
let screen = document.querySelector("#screen");
let pokemonImg = document.querySelector("#pokemonImg");
let description = document.querySelector("#description");
let status = document.querySelector("#status");
let addToBattleList = document.querySelector("#addToBattleList");
let pokemonA = document.querySelector("#pokemonA");
let pokemonB = document.querySelector("#pokemonB");
let battleListDiv = document.querySelector("#battleListDiv");

///////////////// Class /////////////////
class Pokemon {
  constructor(
    name,
    // type,
    img,
    weight,
    height,
    hp,
    attack,
    defence,
    specialAttack,
    specialDefence,
    speed
  ) {
    this.name = name;
    // this.type = type;
    this.img = img;
    this.weight = weight;
    this.height = height;
    this.hp = hp;
    this.attack = attack;
    this.defence = defence;
    this.specialAttack = specialAttack;
    this.specialDefence = specialDefence;
    this.speed = speed;
  }
  compare() {}
}

///////////////// Functions /////////////////
let getData = async (indexNum) => {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexNum}/`);
  data = await response.json();
  return data;
};

///////////////// CTA /////////////////

//Make pokemon drop list
let getPolkemonList = async () => {
  let pokemonList = await getData(`?limit=151`);
  pokemonList.results.forEach((pokemon) => {
    let index = 1;
    let option = document.createElement("option");
    option.innerHTML = `<option value="${index}">${pokemon.name}</option>`;
    selectPokemon.append(option);
    index++;
  });
};
getPolkemonList();

chooseBtn.addEventListener("click", async () => {
  let pokemonData = await getData(selectPokemon.value);
  console.log(pokemonData);

  let name = data.forms[0].name.toUpperCase();
  //   let type = data;
  let img = data.sprites.other["official-artwork"].front_default;
  let weight = data.weight;
  let height = data.height;
  let hp = data.stats[0].base_stat;
  let attack = data.stats[1].base_stat;
  let defence = data.stats[2].base_stat;
  let specialAttack = data.stats[3].base_stat;
  let specialDefence = data.stats[4].base_stat;
  let speed = data.stats[5].base_stat;

  //Create instanse
  let pokemon = new Pokemon(
    name,
    // type,
    img,
    weight,
    height,
    hp,
    attack,
    defence,
    specialAttack,
    specialDefence,
    speed
  );
  console.log(pokemon);

  //DOM
  if (pokemon != null) {
    pokemonImg.classList = "display";
    pokemonImg.src = pokemon.img;
    description.innerHTML = `
      <p>Name: ${pokemon.name}</p>
      <p>Weight: ${pokemon.weight}</p>
      <p>Height: ${pokemon.height}</p>
      <p>Hp: ${pokemon.hp}</p>
      <p>Attack: ${pokemon.attack}</p>`;
  }

  //Add to Battle List
  addToBattleList.addEventListener("click", () => {
    if (pokemon != null) {
      description.innerHTML = `${pokemon.name}, I CHOOSE YOU!`;
      pokemonImg.classList = "displayNone";

      //DOM
      let chosenPokemon = document.createElement("div");
      chosenPokemon.classList = "flex-column";
      let p = document.createElement("p");
      p.innerText = pokemon.name;
      let chosenPokemonImg = document.createElement("img");
      chosenPokemonImg.src = pokemon.img;
      //Delete
      let deteteBtn = document.createElement("button");
      deteteBtn.innerText = "delete";
      deteteBtn.addEventListener("click", () => {
        // Delete from DOM
        chosenPokemon.remove();
        // Remove from battleList
        battleList = battleList.filter(
          (pokemon) => pokemon.img !== chosenPokemonImg.src
        );
        console.log(battleList); // 確認用
      });
      chosenPokemon.append(p, chosenPokemonImg, deteteBtn);

      if (battleListDiv.childElementCount < 2) {
        if (battleList.length > 0) {
          battleList.forEach((p) => {
            if (p.name !== pokemon.name) {
              battleListDiv.append(chosenPokemon);
              battleList.push(pokemon);
              console.log(battleList);
            } else {
              alert("The Pokemon has already been chosen");
            }
          });
        } else {
          //DOM
          battleListDiv.append(chosenPokemon);
          battleList.push(pokemon);
          console.log(battleList);
        }
      } else {
        alert(
          "You already chose 2 pokemon. Delete a pokemon if you want to add another"
        );
      }
    }
    pokemon = null;
  });
});
