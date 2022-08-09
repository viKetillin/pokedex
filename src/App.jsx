import React, { useEffect, useState } from "react";
import PokemonCardComponent from "./components/PokemonCard";

import { FaAngleRight, FaAngleDoubleRight, FaAngleLeft, FaAngleDoubleLeft } from "react-icons/fa"
import { VscLoading } from 'react-icons/vsc'
import InfiniteScroll from "react-infinite-scroll-component";

const App = () => {
    const [pokemonList, setPokemonList] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([])

    const [filter, setFilter] = useState({ perPage: 10, page: 1, paginationType: "default" })
    const [status, setStatus] = useState("")
    const [paginationType, setPaginationType] = useState("default")

    const pageRef = React.createRef()
    const perPageRef = React.createRef()
    const paginationTypeRef = React.createRef()

    function HandleChangeFilters(evt) {
        evt.preventDefault();
        setFilter({ perPage: Number(perPageRef.current.value || 10), paginationType: paginationTypeRef.current.value, page: paginationTypeRef.current.value === "scroll" ? 1 : pageRef.current.value });
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
                })).then(resp => { filter.paginationType === "scroll" ? setFilteredPokemon(f => ([...f, ...resp])) : setFilteredPokemon(resp); setStatus("success"); }).catch(err => {
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
                    .then((data) => {
                        setStatus("success")
                        setPokemonList(
                            data.results.sort((a, b) =>
                                a.name.toUpperCase() < b.name.toUpperCase() ? -1 : 1
                            )
                        )
                    }
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

                        {(function () {
                            return (
                                <>
                                    <label>
                                        <span>Tipo de paginação: </span>
                                        <select onChange={evt => setPaginationType(evt.currentTarget.value)} ref={paginationTypeRef}>
                                            <option value="default">Paginação</option>
                                            <option value="scroll">Scroll Infinito</option>
                                        </select>
                                    </label>
                                    {paginationType !== "scroll" &&
                                        <label>
                                            <span>Página: </span>
                                            <input ref={pageRef} onChange={evt => { evt.currentTarget.value = evt.currentTarget.value <= 0 ? 1 : evt.currentTarget.value > pokemonList.length / filter.perPage ? Math.ceil(pokemonList.length / filter.perPage) : evt.currentTarget.value }} type="number" defaultValue={1} />
                                        </label>}
                                </>
                            )
                        }())}

                        <button type="submit">Filtrar</button>
                    </form>
                </div>
            </div>

            <div className="container">
                {filter.paginationType !== "default" ?
                    <InfiniteScroll
                        dataLength={filteredPokemon ? filteredPokemon.length : 0}
                        next={() => setFilter(f => ({ ...f, page: f.page + 1 }))}
                        hasMore={filter.page < pokemonList.length / filter.perPage}
                        loader={<div className="spin"><VscLoading /></div>}
                    >
                        <div className="pokemon-list">
                            {filteredPokemon.map((pokemon, index) => <PokemonCardComponent key={`${index}-${filter.page}`} data={pokemon} />)}
                        </div>
                    </InfiniteScroll>
                    :
                    {
                        "success": (
                            filter.paginationType === "default" ?
                                <>
                                    <Pagination />
                                    <div className="pokemon-list">
                                        {filteredPokemon.map((pokemon, index) => <PokemonCardComponent key={`${index}-${filter.page}`} data={pokemon} />)}
                                    </div>
                                    <Pagination />
                                </> : <></>
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
