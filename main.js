///////////////// Global Variables //////////////////////////////////
let firstStage = document.querySelector("#firstStage");
let selectDiv = document.querySelector("#select");
let selectPokemon = document.querySelector("#selectPokemon");
let chooseBtn = document.querySelector("#choose");
let pokedex = document.querySelector("#pokedex");
let screen = document.querySelector("#screen");
let pokemonImg = document.querySelector("#pokemonImg");
let description = document.querySelector("#description");
let statusDiv = document.querySelector("#status");
let battleList = [];
let addToBattleList = document.querySelector("#addToBattleList");
let pokemonA = document.querySelector("#pokemonA");
let pokemonB = document.querySelector("#pokemonB");
let battleListDiv = document.querySelector("#battleListDiv");
let compareDiv = document.querySelector("#compare");
let compareBtn = document.querySelector("#compareBtn");
let compareStatus = document.querySelector("#compareStatus");
let pokemonAwin = 0;
let pokemonBwin = 0;
let battleDiv = document.querySelector("#battle");
let startBattleBtn = document.querySelector("#startBattleBtn");
let battleField = document.querySelector("#battleField");
let comment = document.querySelector("#comment");
let attackBtns = document.querySelector("#attackBtns");
let attackA = document.querySelector("#attackA");
let attackB = document.querySelector("#attackB");
let battleBGM = new Audio("./sound/battleBGM.ogg");
let endingBGM = new Audio("./sound/endingBGM.ogg");
let fanfare = new Audio("./sound/fanfare.ogg");
let stopBGM = document.querySelector("#stopBGM");

///////////////// Class //////////////////////////////////
class Pokemon {
  constructor(
    name,
    type,
    img,
    weight,
    height,
    hp,
    attack,
    defence,
    specialAttack,
    specialDefence,
    speed,
    move,
    cry
  ) {
    this.name = name;
    this.type = type;
    this.img = img;
    this.weight = weight;
    this.height = height;
    this.hp = hp;
    this.attack = attack;
    this.defence = defence;
    this.specialAttack = specialAttack;
    this.specialDefence = specialDefence;
    this.speed = speed;
    this.move = move;
    this.cry = cry;
  }

  static compare(status, pokemonA, pokemonB) {
    let resultText = document.createElement("div");
    let higherPokemon = document.createElement("span");
    let result = document.createElement("span");

    if (pokemonA[status] > pokemonB[status]) {
      higherPokemon.innerText = pokemonA.name;
      higherPokemon.style.color = "red";
      result = ` wins in ${status}`;
      pokemonAwin++;
    } else if (pokemonA[status] < pokemonB[status]) {
      higherPokemon.innerText = pokemonB.name;
      higherPokemon.style.color = "blue";
      result = ` wins in ${status}`;
      pokemonBwin++;
    } else {
      result = `Even in ${status}`;
    }

    resultText.append(higherPokemon, result);
    compareStatus.append(resultText);
  }

  giveAttack(opponent) {
    let damage =
      this.attack +
      this.specialAttack -
      (this.defence + this.specialDefence) * 0.8;
    if (damage < 10) {
      damage = 10;
    }
    opponent.hp -= damage;

    // DOM opponent
    let progress = document.querySelector(`#${opponent.name}HP`);
    progress.value = opponent.hp;

    // Progress bar color
    let opponentMaxHP = document.querySelector(`#${opponent.name}HP`).max;
    if (opponent.hp / opponentMaxHP < 0.25) {
      progress.classList = "red";
    } else if (opponent.hp / opponentMaxHP < 0.5) {
      progress.classList = "yellow";
    } else {
      progress.classList = "blue";
    }

    // DOM attack animation
    let opponentImg = document.querySelector(`#${opponent.name}Img`);
    opponentImg.remove();
    let newOpponentImg = document.createElement("img");
    newOpponentImg.id = `${opponent.name}Img`;
    newOpponentImg.classList = "playerImg attacked";
    newOpponentImg.src = opponent.img;
    let playerDiv = document.querySelector(`#${opponent.name}PlayerDiv`);

    // DOM comment
    if (opponent.hp <= 0) {
      opponent.hp = 0;
    }
    comment.innerText = `
        ${this.name} used ${this.move}! \n
        ${opponent.name} got ${Math.floor(damage)} damage!\n
        ${opponent.name} remaining HP: ${Math.floor(opponent.hp)}
    `;

    //勝負あり
    if (opponent.hp <= 0) {
      newOpponentImg.classList = "playerImg lost";

      let result = document.createElement("p");
      result.style.color = "red";
      result.innerText = `
        ${opponent.name} fainted!\n
        ${this.name} wins!`;
      comment.append(result);

      //断末魔
      let cry = new Audio(opponent.cry);
      cry.play();
      //BGM 変更
      battleBGM.pause();
      setTimeout(() => {
        endingBGM.volume = "0.3";
        endingBGM.play();
      }, 1000);

      //Replay
      attackBtns.innerHTML = "";
      let replay = document.createElement("button");
      replay.innerText = "Replay";
      replay.addEventListener("click", () => {
        fanfare.volume = "0.3";
        fanfare.play();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
      attackBtns.append(replay);
    } else {
      //attack sound
      let attackSound = new Audio(`./sound/attack.mp3`);
      attackSound.play();
    }

    playerDiv.append(newOpponentImg);

    return opponent.hp;
  }
}

///////////////// Functions //////////////////////////////////

// Fetch API
let getData = async (indexNum) => {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${indexNum}/`);
  data = await response.json();
  return data;
};

// Pokedex Header
let pokedexHeader = () => {
  const headerLeft = document.querySelector(".headerLeft");
  const headerRight = document.querySelector(".headerRight");
  const pokedexHeader = document.querySelector("#pokedexHeader");

  if (headerLeft && headerRight && pokedexHeader) {
    const headerLeftWidth = headerLeft.offsetWidth;
    const pokedexHeaderWidth = pokedexHeader.offsetWidth;
    const headerRightWidth = pokedexHeaderWidth - headerLeftWidth;

    headerRight.style.width = `${headerRightWidth}px`;
  }
};

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
let getPokemonList = async () => {
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
let renderPlayer = (pokemon, slide) => {
  let playerDiv = document.createElement("div");
  playerDiv.id = `${pokemon.name}PlayerDiv`;
  playerDiv.classList = `playerDiv flex-row ${slide}`;
  playerDiv.innerHTML = `
    <div class="playerStatus flex-column">
        <p>${pokemon.name}</p>
        <progress id="${pokemon.name}HP" value="${pokemon.hp}" max="${pokemon.hp}" class="start"></progress>
    </div>
    <img id="${pokemon.name}Img"  class="playerImg" src="${pokemon.img}" alt="playerImage">
    `;
  battleField.append(playerDiv);
};

///////////////// CTA //////////////////////////////////

// Resize pokedex header
window.addEventListener("load", pokedexHeader());
window.addEventListener("resize", pokedexHeader());
//Render pokemon drop list by refresh
getPokemonList();

// CTA: Choose pokemon to pokedex
let pokemon;
chooseBtn.addEventListener("click", async () => {
  if (selectPokemon.value) {
    let data = await getData(selectPokemon.value);
    console.log(data);

    let name = data.forms[0].name.toUpperCase();
    let type = data.types;
    let img = data.sprites.other["official-artwork"].front_default;
    let weight = data.weight;
    let height = data.height;
    let hp = data.stats[0].base_stat;
    let attack = data.stats[1].base_stat;
    let defence = data.stats[2].base_stat;
    let specialAttack = data.stats[3].base_stat;
    let specialDefence = data.stats[4].base_stat;
    let speed = data.stats[5].base_stat;
    let move = data.moves[0].move.name;
    let cry = data.cries.legacy;

    //Create instanse
    let NewPokemon = new Pokemon(
      name,
      type,
      img,
      weight,
      height,
      hp,
      attack,
      defence,
      specialAttack,
      specialDefence,
      speed,
      move,
      cry
    );

    pokemon = NewPokemon;

    // Check second type
    let secondtype = "";
    if (pokemon.type.length >= 2) {
      secondtype = `, ${pokemon.type[1].type.name}`;
    }

    // DOM
    pokemonImg.classList = "display";
    pokemonImg.src = pokemon.img;
    description.innerHTML = `
      <p>Name: ${pokemon.name}</p>
      <p>Type: ${pokemon.type[0].type.name}${secondtype} </p>
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

    //CTA: Add to Battle List
    addToBattleList.addEventListener("click", () => {
      //前に使用したポケモンをはじく
      if (pokemon != null) {
        // DOM Reset (screen)
        description.innerText = `${pokemon.name},\n I CHOOSE YOU!`;
        pokemonImg.classList = "displayNone";
        statusDiv.innerHTML = "";

        //DOM (battleList)
        let chosenPokemon = document.createElement("div");
        chosenPokemon.classList = "flex-column";
        let p = document.createElement("p");
        p.innerText = pokemon.name;
        let chosenPokemonImg = document.createElement("img");
        chosenPokemonImg.src = pokemon.img;
        //Delete Btn
        let deteteBtn = document.createElement("button");
        deteteBtn.innerText = "Back to Ball";
        deteteBtn.addEventListener("click", () => {
          // Delete from DOM
          chosenPokemon.remove();
          // Remove from battleList
          battleList = battleList.filter(
            (pokemon) => pokemon.img !== chosenPokemonImg.src
          );
          console.log(battleList); // 確認用
        });
        chosenPokemon.append(p, deteteBtn, chosenPokemonImg);

        // ベンチにスペースがある場合
        if (battleListDiv.childElementCount < 2) {
          if (battleList.length > 0) {
            // BattleListの中に選択済みポケモンがいるか確認
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
            // DOM
            battleListDiv.append(chosenPokemon);
            battleList.push(pokemon);
            console.log(battleList);
          }
          // Cry
          let cry = new Audio(pokemon.cry);
          cry.play();
        } else {
          alert(
            "You already chose 2 pokemons. Back a pokemon to the ball if you want to add anothe."
          );
          description.innerText =
            "Choose a pokemon by the drop-down list above";
        }
      }
      if (battleList.length >= 2) {
        compareBtn.classList = "display";
        startBattleBtn.classList = "display";
      } else {
        compareBtn.classList = "displayNone";
        startBattleBtn.classList = "displayNone";
      }
      //battleListに追加後、後ではじけるようNullに変える。（pokemon値を新しいポケモンに使い回せるようにする）
      pokemon = null;
    });
  } else {
    alert("Choose a pokemon by the dropdown-List");
  }
});

// CTA: Compare Pokemon
compareBtn.addEventListener("click", () => {
  pokemonAwin = 0;
  pokemonBwin = 0;
  compareStatus.innerHTML = "";
  // Pokemon.compare("height", battleList[0], battleList[1]);
  // Pokemon.compare("weight", battleList[0], battleList[1]);
  Pokemon.compare("hp", battleList[0], battleList[1]);
  Pokemon.compare("attack", battleList[0], battleList[1]);
  Pokemon.compare("defence", battleList[0], battleList[1]);
  Pokemon.compare("s-attack", battleList[0], battleList[1]);
  Pokemon.compare("s-defence", battleList[0], battleList[1]);
  Pokemon.compare("speed", battleList[0], battleList[1]);
  console.log(pokemonAwin, pokemonBwin);

  let summaryText = document.createElement("p");
  if (pokemonAwin > pokemonBwin) {
    summaryText.innerText = `
    ${battleList[0].name} wins in the most status`;
  } else if (pokemonAwin < pokemonBwin) {
    summaryText.innerText = `
    ${battleList[1].name} wins in the most status`;
  } else {
    summaryText.innerText = `
    ${battleList[0].name} and ${battleList[1].name} are mostly even in status. \n Let's see which wins.`;
  }
  compareStatus.append(summaryText);
});

// CTA: Open Battle Field
startBattleBtn.addEventListener("click", () => {
  // Close first stage and open battleField
  firstStage.classList = "displayNone";
  battleDiv.classList = "flex-column display";

  // Get players from array
  let pokemonA = battleList[1];
  let pokemonB = battleList[0];

  // Music
  battleBGM.volume = "0.3";
  battleBGM.play();

  // Render players
  renderPlayer(pokemonA, "slideinRight");
  renderPlayer(pokemonB, "slideinLeft");

  // Attack Btns
  // Put name on Btns
  attackA.innerText = `${pokemonA.name}'s Attack!`;
  attackB.innerText = `${pokemonB.name}'s Attack!`;

  // Open Btn for faster Pokemon
  if (pokemonA.speed > pokemonB.speed) {
    attackA.disabled = false;
    attackB.disabled = true;
    comment.innerText = `
    Let's Battle! \n 
    ${pokemonA.name} is faster than ${pokemonB.name}.
    `;
  } else {
    attackA.disabled = true;
    attackB.disabled = false;
    comment.innerText = `
    Let's Battle! \n 
    ${pokemonB.name} is faster than ${pokemonA.name}.
    `;
  }

  // CTA: Attack
  attackA.addEventListener("click", () => {
    pokemonA.giveAttack(pokemonB);
    attackA.disabled = true;
    attackB.disabled = false;
  });
  attackB.addEventListener("click", () => {
    pokemonB.giveAttack(pokemonA);
    attackB.disabled = true;
    attackA.disabled = false;
  });

  // CTA: Stop BGM
  stopBGM.addEventListener("click", () => {
    battleBGM.pause();
    endingBGM.pause();
  });
});
