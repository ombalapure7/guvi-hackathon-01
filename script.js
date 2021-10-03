// Original pokemon card count
var count = 50;

// Set no. of pokemons you wish to see on screen
function setLimit() {
  document.querySelector(".textInfo").innerHTML = "";

  let limit = document.getElementById("pokemonCount").value;
  // Check for numbers
  let regex = /^[0-9]+$/;

  console.log("Limit entered: ", limit);

  if (!limit.match(regex)) {
    document.querySelector(".textInfo").innerHTML = `<p class="p-3 mb-2 bg-danger text-white"><strong>Input must be a proper number!</strong></p>`;
    limit = 50;
  }

  if (limit <= 0) {
    document.querySelector(".textInfo").innerHTML = `<p class="p-3 mb-2 bg-secondary text-white"><strong>Number cannot be negative or 0</strong></p>`;
    limit = 50;
  } 

  if (limit > 1118) {
    document.querySelector(".textInfo").innerHTML = `<p class="p-3 mb-2 bg-info text-white"><strong>Currently data for 1118 pokemons available...</strong></p>`;
    limit = 50;
  }

  count = parseInt(limit);
  // Reload pokemon data
  displayPokemon();
}

/**
 * @description Get the data of all the pokemons
 * @returns List of pokemon data gathered using FETCH API
 */
async function getAllPokemonData() {
  try {
    const data = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${count}`, {
      method: "GET",
    });

    const pokemons = await data.json();
    return pokemons;
  } catch (err) {
    console.log("Error while fetching data: ", err);
  }
}


/**
 * @description Display pokemon data in card format
 */
async function displayPokemon() {
  try {
    const pokemonDataArr = [];
    const pokemons = await getAllPokemonData();

    // Create pokemon card
    let createPokemonCard = (name, image, abilities, moves, weight) => {
      return `
      <div class="image-wrapper">
        <img src="${image}" />
      </div>
      <div class="description">
        <p class="fw-bolder pokemon-name">
          ${name}
        </p>
        <p><strong>Weight</strong>: ${weight} lbs</p>
        <p><strong>Moves</strong>: ${moves}</p>
        <p><strong>Abilities</strong>: ${abilities}</p>
      </div>
    `;
    };

    // Display updat ed data
    document.querySelector(".pokemon-list").innerHTML = "";

    // Iterate over the fetched list of pokemons
    pokemons.results.forEach((pokemon) => {
      // Filter ability, moves, wright
      const pokemonObj = filterPokemonAttributes(pokemon);

      pokemonObj
        .then((pokemon) => {
          let div = document.createElement("div");
          div.className = "pokemon-card";
          div.innerHTML = createPokemonCard(pokemon.name, pokemon.image,
            pokemon.abilities, pokemon.moves, pokemon.weight);

          // Append the card to the page
          document.querySelector(".pokemon-list").append(div);
          pokemonDataArr.push(pokemon);
        })
        .catch((err) => {
          console.log("Error while filtering pokemon attributes: ", err);
        });
    });
  } catch (err) {
    console.log("Error while diplaying data: ", err);
  }
}

/**
 * @description This function constructs a Pokemon object
 * @param pokemon 
 * @returns Pokemon Object which contains - name, abilities, moves and weight of a pokemon
 */
async function filterPokemonAttributes(pokemon) {
  try {
    const data = await fetch(`${pokemon.url}`, {
      method: "GET",
    });
  
    const pokemonAttributes = await data.json();
  
    // Filter abilites
    const pokemonAbilities = pokemonAttributes.abilities;
    const pokemonAbilitiesArr = [];
  
    for (let i = 0; i < pokemonAbilities.length; i++) {
      pokemonAbilitiesArr.push(pokemonAbilities[i].ability.name);
    }
  
    // Filter weight
    const pokemonWeight = pokemonAttributes.weight;
  
    // Filter moves
    const pokemonMoves = pokemonAttributes.moves;
    const pokemonMovesArr = [];
  
    for (let i = 0; i < 3; i++) {
      pokemonMovesArr.push(pokemonMoves[i].move.name);
    }
  
    const pokemonObj = {
      name: pokemon.name,
      weight: pokemonWeight,
      abilities: pokemonAbilitiesArr,
      moves: pokemonMovesArr,
      image: pokemonAttributes.sprites.other.dream_world.front_default,
    };
  
    return pokemonObj;
  } catch (err) {
    console.log("Error while processing pokmon data: ", err);
  }
}

/**
 * Heading section
 */
let heading = document.createElement("div");
heading.className = "heading-content"; 
heading.innerHTML = `
  <p class="title-heading">PokemonX API</p>
  <div class="title-logo">
    <img height="50rem" width="50rem" src="images/pokeball-heading.svg">
  </div>
`;

document.querySelector(".heading").append(heading);

/**
 * Creating the jumbotron
 */
let jumbotronContent = document.createElement("div");
jumbotronContent.className = "jumbotron-content";
jumbotronContent.innerHTML = `
  <h1 class="display-4">Hello, there!</h1>
  <p class="lead">This is a web page where you can see the list of pokemons</p>
  <p class="lead">Checkout the abilities, moves or weight of your favorite pokemon(s)</p>
  <a href="https://github.com/ombalapure7/guvi-hackathon-01" type="button" class="btn btn btn-info btn-lg">Know More</a>
  <hr class="my-4">
  <p>Set limit for the number of pokemons, you want to see on the screen</p>
  <div class="textInfo"></div>
  <div class="input-group mb-3">
    <input type="search" id="pokemonCount" class="form-control" placeholder="Enter number..."
      aria-label="Recipient's username" aria-describedby="button-addon2">
    <button class="btn btn-primary" onclick="setLimit(event)" type="button" id="button-addon2">List
      Pokemons
    </button>
  </div>
`;
document.querySelector(".jumbotron").append(jumbotronContent);

/**
 * Footer content
 */
let footer = document.createElement("div");
footer.className = "footer-content"; 
footer.innerHTML = `
  <div class="text-right">
  <p>Made with <i class="fas fa-heart"></i> by <span>Om Balapure</span></p>
  </div>
`
;
document.querySelector(".footer").append(footer);

/**
 * Execute the function on page load
 * This function loads the pokemon data on the screen (50 pokemon cards - by default)
 */
window.onload = displayPokemon();
