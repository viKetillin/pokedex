import React, { useEffect, useState } from "react";
import PokemonCardComponent from "./components/PokemonCard";

import { FaAngleRight, FaAngleDoubleRight, FaAngleLeft, FaAngleDoubleLeft } from "react-icons/fa"
import { VscLoading } from 'react-icons/vsc'

const App = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([])

    const [filter, setFilter] = useState({ perPage: 10, page: 1 })
    const [status, setStatus] = useState("")

    const perPageRef = React.createRef()

    function HandleChangeFilters(evt) {
        evt.preventDefault();
        setFilter({ perPage: Number(perPageRef.current.value || 10), page: 1 });
    }

    useEffect(() => {
        if (pokemonList) {
            setStatus("loading");
            Promise.all(pokemonList.filter((__, index) => index - 1 > (filter.perPage * filter.page) - filter.perPage && index - 1 <= (filter.perPage * filter.page))
                .map(pokemon => {
                    return (async function () {
                        return await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
                            .then((response) => response.json()).then(data => data)
                    }())
                })).then(resp => { setFilteredPokemon(resp); setStatus("success"); }).catch(err => {
                    console.error(err);
                    setStatus("error");
                })
        }
    }, [pokemonList, filter])

    useEffect(() => {
        setStatus("loading");
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
                    .catch(err => { console.error(err); setStatus("error"); })
            );
    }, []);

    function Pagination() {
        return (
            <div className="pagination">
                <button onClick={() => setFilter({ ...filter, page: 1 })} type="button" disabled={!(filter.page > 1)}><FaAngleDoubleLeft /></button>
                <button onClick={() => setFilter({ ...filter, page: filter.page - 1 })} disabled={!(filter.page > 1)}><FaAngleLeft /></button>

                {filter.page > 3 && <button onClick={() => setFilter({ ...filter, page: filter.page - 3 })} type="button">{filter.page - 3}</button>}
                {filter.page > 2 && <button onClick={() => setFilter({ ...filter, page: filter.page - 2 })} type="button">{filter.page - 2}</button>}
                {filter.page > 1 && <button onClick={() => setFilter({ ...filter, page: filter.page - 1 })} type="button">{filter.page - 1}</button>}

                {<button type="button" className="selected">{filter.page}</button>}

                {filter.page + 1 < (pokemonList.length / filter.perPage) + 1 && <button onClick={() => setFilter({ ...filter, page: filter.page + 1 })} type="button">{filter.page + 1}</button>}
                {filter.page + 2 < (pokemonList.length / filter.perPage) + 1 && <button onClick={() => setFilter({ ...filter, page: filter.page + 2 })} type="button">{filter.page + 2}</button>}
                {filter.page + 3 < (pokemonList.length / filter.perPage) + 1 && <button onClick={() => setFilter({ ...filter, page: filter.page + 3 })} type="button">{filter.page + 3}</button>}

                <button onClick={() => setFilter({ ...filter, page: filter.page + 1 })} type="button" disabled={!(filter.page < pokemonList.length / filter.perPage)}><FaAngleRight /></button>
                <button onClick={() => setFilter({ ...filter, page: Math.ceil(pokemonList.length / filter.perPage) })} disabled={!(filter.page < pokemonList.length / filter.perPage)} type="button"><FaAngleDoubleRight /></button>
            </div>
        )
    }

    return (
        <>
            <header>
                <div className="container">
                    <div>
                        PokeApi
                    </div>
                </div>
            </header>
            <div style={{ backgroundColor: "#00000000" }} className="container">
                <div className="perpage-form">
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
                </div>
            </div>

            <div className="container">
                {
                    {
                        "success": (
                            <>
                                <Pagination />
                                <div className="pokemon-list">
                                    {filteredPokemon.map((pokemon, index) => <PokemonCardComponent key={`${index}-${filter.page}`} data={pokemon} />)}
                                </div>
                                <Pagination />
                            </>
                        ),
                        "error": (
                            <>
                                An Error ocurred!
                            </>
                        ),
                        "loading": (
                            <>
                                <Pagination />
                                <div className="spin">
                                    <VscLoading />
                                </div>
                                <Pagination />
                            </>
                        )
                    }[status]
                }
            </div>
        </>
    );
};

export default App;
