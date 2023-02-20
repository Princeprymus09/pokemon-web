import "./App.css";
import Axios from "axios";
import { useEffect, useRef, useState } from "react";

const PokeTile = ({ pokemon }) => {
  const divStyle = {};
  return (
    <div style={divStyle}>
      <h1>{pokemon.name}</h1>
      <img src={pokemon.img} />
      <h3>Species:{pokemon.species}</h3>
    </div>
  );
};

const Loader = () => (
  <div class="loader loader--style1" title="0">
    <svg
      version="1.1"
      id="loader-1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="40px"
      height="40px"
      viewBox="0 0 40 40"
      enable-background="new 0 0 40 40"
    >
      <path
        opacity="0.2"
        fill="#000"
        d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
  s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
  c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
      />
      <path
        fill="#000"
        d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
  C22.32,8.481,24.301,9.057,26.013,10.047z"
      >
        <animateTransform
          attributeType="xml"
          attributeName="transform"
          type="rotate"
          from="0 20 20"
          to="360 20 20"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  </div>
);

function App() {
  const [singleSearch, setSingleSearch] = useState();
  const [searchString, setSearchString] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  const [offset, setOffset] = useState(0);
  const tileRef = useRef();

  const getSingleItem = async (searchString) => {
    const response = await Axios.get(
      `https://pokeapi.co/api/v2/pokemon/${searchString}`
    );

    setSingleSearch({
      name: response. data.name,
      species: response.data.species.name,
      img: response.data.sprites.front_default,
    });
  };

  const fetchPokemons = async () => {
    const response = await Axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=0&offset=${offset}`
    );

    const pokemonWithDetails = await Promise.all(
      response.data.results.map(async (item) => {
        const pokemonDetails = await Axios.get(item.url);

        return {
          name: item.name,
          species: pokemonDetails.data.species.name,
          img: pokemonDetails.data.sprites.front_default,
        };
      })
    );

    setPokemonList([...pokemonList, ...pokemonWithDetails]);
    setOffset(offset + 20);
    setShowLoader(false);
  };

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = tileRef.current;
    const bottom = Math.ceil(scrollTop) + clientHeight === scrollHeight;

    if (bottom && !showLoader) {
      setShowLoader(true);
      setTimeout(() => {
        fetchPokemons();
      }, 3000);
    }
  };

  useEffect(() => {
    setShowLoader(true);
    setTimeout(() => {
      fetchPokemons();
    }, 3000);
  }, []);

  return (
    <>
      <div className="App">
        <div
          className="TitelSection"
          style={{ height: "10vh", display: "flex" }}
        >
          <div>
            <h3>Pokemon stats</h3>
          </div>
          <div>
            <input
              type="text"
              onChange={(e) => {
                setSearchString(e.target.value);
              }}
            />
          </div>
          <div>
            <button
              style={{ display: "flex" }}
              onClick={() => {
                getSingleItem(searchString);
              }}
            >
              Search Pokemon
            </button>
          </div>
        </div>
        {!singleSearch ? (
          <div
            className="DisplaySection"
            onScroll={handleScroll}
            style={{ height: "90vh", overflow: "auto" }}
            ref={tileRef}
          >
            {pokemonList.length ? (
              pokemonList.map((item) => (
                <PokeTile key={item.name} pokemon={item}></PokeTile>
              ))
            ) : (
              <></>
            )}
            {showLoader && <Loader />}
          </div>
        ) : (
          <div class="SearchResults" style={{ position: "relative" }}>
            <button
              style={{ position: "absolute", right: "20px", top: "20px" }}
              onClick={() => {
                setSingleSearch(undefined);
              }}
            >
              X
            </button>
            <PokeTile pokemon={singleSearch} />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
