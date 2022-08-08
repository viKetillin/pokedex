import React, { useEffect, useState } from "react";
import PokemonCardComponent from "./components/PokemonCard";

const App = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([])

    const [filter, setFilter] = useState({ perPage: 10, page: 1 });

    const perPageRef = React.createRef();

    function HandleChangeFilters(evt) {
        evt.preventDefault();
        setFilter({ perPage: Number(perPageRef.current.value || 10), page: 1 });
    }

    useEffect(() => {
        if (pokemonList)
            Promise.all(pokemonList.filter((__, index) => index - 1 > (filter.perPage * filter.page) - filter.perPage && index - 1 <= (filter.perPage * filter.page))
                .map(pokemon => {
                    return (async function () {
                        return await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
                            .then((response) => response.json()).then(data => data)
                    }())
                })).then(resp => setFilteredPokemon(resp))
    }, [pokemonList, filter])

    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1")
            .then((response) => response.json())
            .then((data) =>
                fetch(`https://pokeapi.co/api/v2/pokemon/?offset=0&limit=${data.count}`)
                    .then((response) => response.json())
                    .then((data) =>
                        setPokemonList(
                            data.results.sort((a, b) =>
                                a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
                            )
                        )
                    )
                    .catch(console.error)
            );
    }, []);

    return (
        <div className="container">
            <form onSubmit={HandleChangeFilters}>
                <label>
                    <span>Por Página: </span>
                    <select ref={perPageRef}>
                        {[10, 20, 30].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Filtrar</button>
            </form>
            <div>
                {filteredPokemon.map((pokemon, index) => <PokemonCardComponent key={`${index}-${filter.page}`} data={pokemon} />)}
            </div>
        </div>
    );
};

export default App;
