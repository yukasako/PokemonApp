///////////////// Global Variables /////////////////
let battleList = [];
let selectDiv = document.querySelector("#select");
let selectPokemon = document.querySelector("#selectPokemon");
let chooseBtn = document.querySelector("#choose");
let pokedex = document.querySelector("#pokedex");
let screen = document.querySelector("#screen");
let pokemonImg = document.querySelector("#pokemonImg");
let description = document.querySelector("#description");
let statusDiv = document.querySelector("#status");
let addToBattleList = document.querySelector("#addToBattleList");
let pokemonA = document.querySelector("#pokemonA");
let pokemonB = document.querySelector("#pokemonB");
let battleListDiv = document.querySelector("#battleListDiv");
let compareDiv = document.querySelector("#compare");
let battleDiv = document.querySelector("#battle");
let startBattleBtn = document.querySelector("#startBattleBtn");
let battleField = document.querySelector("#battleField");
let attackA = document.querySelector("#attackA");
let attackB = document.querySelector("#attackB");

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

  giveAttack(opponent) {
    let damage =
      this.attack +
      this.specialAttack -
      (this.defence + this.specialDefence) * 0.8;
    if (damage < 10) {
      damage = 10;
    }
    console.log(`Damage`, damage);
    opponent.hp -= damage;
    return opponent.hp;
  }
}

///////////////// Functions /////////////////

// Fetch API
let getData = async (indexNum) => {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexNum}/`);
  data = await response.json();
  return data;
};

// Pokedex Header
window.addEventListener("resize", () => {
  const headerLeft = document.querySelector(".headerLeft");
  const headerRight = document.querySelector(".headerRight");
  const pokedexHeader = document.querySelector("#pokedexHeader");

  if (headerLeft && headerRight && pokedexHeader) {
    const headerLeftWidth = headerLeft.offsetWidth;
    const pokedexHeaderWidth = pokedexHeader.offsetWidth;
    const headerRightWidth = pokedexHeaderWidth - headerLeftWidth;

    headerRight.style.width = `${headerRightWidth}px`;
  }
});

// Render status
let renderStat = (status, value) => {
  let aStatus = document.createElement("div");
  let label = document.createElement("label");
  label.innerText = status;
  label.for = status;
  let progress = document.createElement("progress");
  progress.id = `${status}Progress`;
  progress.value = value;
  progress.max = 100;
  aStatus.append(label, progress);
  statusDiv.append(aStatus);
};

//Render pokemon drop
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

//Render to Battle field
let renderPlayer = (pokemon) => {
  let playerDiv = document.createElement("div");
  playerDiv.classList = "playerDiv flex-row";
  playerDiv.innerHTML = `
    <div class="playerStatus">
        <p>${pokemon.name}</p>
        <progress id="${pokemon.name}HP" value="${pokemon.hp}" max="100"></progress>
    </div>
    <img class="playerImg" id="${pokemon.name}Img" src="${pokemon.img}" alt="playerImage">`;
  battleField.append(playerDiv);
};

///////////////// CTA /////////////////

//Render pokemon drop list by refresh
getPolkemonList();

let pokemon;
// CTA: Choose pokemon to pokedex
chooseBtn.addEventListener("click", async () => {
  if (selectPokemon.value) {
    let data = await getData(selectPokemon.value);

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
    let NewPokemon = new Pokemon(
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

    pokemon = NewPokemon;

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

      statusDiv.innerHTML = "";
      renderStat("HP", pokemon.hp);
      renderStat("Attack", pokemon.attack);
      renderStat("Defence", pokemon.defence);
      renderStat("S-Attack", pokemon.specialAttack);
      renderStat("S-Defence", pokemon.specialDefence);
      renderStat("Speed", pokemon.speed);

      console.log(pokemon);
    }

    //CTA: Add to Battle List
    addToBattleList.addEventListener("click", () => {
      if (pokemon != null) {
        // DOM (screen)
        description.innerHTML = `${pokemon.name}, I CHOOSE YOU!`;
        pokemonImg.classList = "displayNone";
        statusDiv.innerHTML = "";

        //DOM (battleList)
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
            //BattleListの中に選択済みポケモンがいるか確認
            battleList.forEach((p) => {
              if (p.name !== pokemon.name) {
                battleListDiv.append(chosenPokemon);
                battleList.push(pokemon);
                console.log(battleList);
                return battleList;
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
  } else {
    alert("Choose a pokemon by the dropdown-List");
  }
});

// Open Battle Field
startBattleBtn.addEventListener("click", () => {
  //DisplayNone
  selectDiv.classList = "displayNone";
  pokedex.classList = "displayNone";
  battleListDiv.classList = "displayNone";
  compareDiv.classList = "displayNone";
  startBattleBtn.classList = "displayNone";

  //Open battleField
  battleDiv.classList = "flex-column display";

  // Render Battle Field
  console.log(battleList);
  battleList.forEach((pokemon) => {
    renderPlayer(pokemon);
  });

  //Put name on Btn
  attackA.innerText = `${battleList[1].name}'s Attack!`;
  attackB.innerText = `${battleList[0].name}'s Attack!`;
});

// Attack
attackA.addEventListener("click", () => {
  console.log(battleList[0].hp);
  battleList[1].giveAttack(battleList[0]);
  console.log(battleList[0].hp);

  battleField.innerHTML = "";
  battleList.forEach((pokemon) => {
    renderPlayer(pokemon);
  });
});

attackB.addEventListener("click", () => {
  console.log(battleList[1].hp);
  battleList[0].giveAttack(battleList[1]);
  console.log(battleList[1].hp);

  battleField.innerHTML = "";
  battleList.forEach((pokemon) => {
    renderPlayer(pokemon);
  });
});
