import logo from "./logo.svg";
import "./App.css";
import Axios from "axios";
import { useState } from "react";

function App() {
  const [pokemonName, SetpokemonName] = useState("");
  const [pokemonChoosen, SetpokemonChoosen] = useState(false);
  const [pokemon, Setpokemon] = useState({
    name: "",
    species: "",
    img: "",
    hp: "",
    attack: "",
    defense: "",
    type: "",
  });
  const SearchPokemon = () => {
    Axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(
      (response) => {
        Setpokemon({
          name: pokemonName,
          species: response.data.species.name,
          img: response.data.sprites.front_default,
          hp: response.data.stats[0].base_stat,
          attack: response.data.stats[1].base_stat,
          defense: response.data.stats[2].base_stat,
          type: response.data.types[0].type.name,
        });
        SetpokemonChoosen(true);
      }
    );
  };
  return (
    <>
      <div className="App">
        <div className="TitelSection">
          <h1>Pokemon stats</h1>
          <input
            type="text"
            onChange={(e) => {
              SetpokemonName(e.target.value);
            }}
          />
          <button onClick={SearchPokemon}>Search Pokemon</button>
        </div>
        <div className="DisplaySection">{!pokemonChoosen ?(
        <h1>please choose a pokemon</h1>
        ) :(
          <>
            <h1>{pokemon.name}</h1>
            <img src={pokemon.img} />
            <h3>Species:{pokemon.species}</h3>
            <h3>Type:{pokemon.type}</h3>
            <h4>Hp: {pokemon.hp}</h4>
            <h4>Attack:{pokemon.attack}</h4>
            <h4>Defence:{pokemon.defense}</h4>
          </>
        

        )}
        </div>
      </div>
    </>
  );
}

export default App;
