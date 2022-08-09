import { useEffect, useState } from "react"
import Outclick from "./Outclick"

function PokemonCardComponent({ data }) {

    const [showMoreInfo, setShowMoreInfo] = useState(false)

    const [abilities] = useState(data.abilities)

    const [selectedMove, setSelectedMove] = useState()

    const [selectedItem, setSelectedItem] = useState()

    console.log(selectedItem)

    const [specie, setSpecie] = useState()

    const [moves] = useState(data.moves)

    useEffect(() => {
        document.body.style.overflowY = showMoreInfo ? "hidden" : "auto";
        if (showMoreInfo) {
            fetch(data.species?.url)
                .then((response) => response.json())
                .then((data) => setSpecie(data))
        } else {
            setSelectedMove(undefined)
            setSelectedItem(undefined)
        }
    }, [showMoreInfo, data])
    return (
        <>
            {showMoreInfo &&
                <div className="full-screen-background">
                    <Outclick callback={() => setShowMoreInfo(false)}>
                        <div className="pokemon-info-panel">
                            <div className="panel-header" style={{ backgroundColor: `var(--${data.types[0].type.name}-dark)` }}>
                                <h1>{data.name}</h1>
                            </div>
                            <div className="panel-body">
                                <div className="info">
                                    <div className="versions">
                                        <div>
                                            {data.types.map(type => (
                                                <span className="pokemon-type" key={type.type.name} style={{ backgroundColor: `var(--${type.type.name}-dark)` }}> {type.type.name}</span>
                                            ))}
                                        </div>
                                        <div className="image">
                                            <img src={data.sprites.front_default} alt={data.name} />
                                        </div>
                                    </div>
                                    <div className="general-info">
                                        <section>
                                            <h1>Stats:</h1>
                                            <hr />
                                            <div className="stats-buttons">
                                                {data.stats.map(stat => (
                                                    <div key={stat.stat.name}>
                                                        <span>{stat.stat.name}: {stat.base_stat}
                                                            <label>Effort: {stat.effort}</label>
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>
                                    </div>
                                </div>
                                <div className="base-height">
                                    <div><span>base experience: </span> {data.base_experience}</div>
                                    <div><span>height: </span> {data.height}</div>
                                    <div><span>order: </span> {data.order}</div>
                                    {specie?.name &&
                                        <div><span>specie: </span> {specie.name}</div>}
                                    {specie?.base_happiness &&
                                        <div><span>base happiness: </span> {specie.base_happiness}</div>}
                                    {specie?.capture_rate &&
                                        <div><span>capture rate: </span> {specie.capture_rate}</div>}
                                    {specie?.growth_rate &&
                                        <div><span>growth rate: </span> {specie?.growth_rate?.name}</div>}
                                    {specie?.has_gender_differences &&
                                        <div><span>has gender differences </span></div>}
                                    {specie?.is_baby &&
                                        <div><span>is baby</span></div>}
                                    {specie?.is_legendary &&
                                        <div><span>is legendary</span></div>}
                                    {specie?.is_mythical &&
                                        <div><span>is mythical</span></div>}
                                    {specie?.forms_switchable &&
                                        <div><span>forms switchable</span></div>}
                                    {specie?.shape &&
                                        <div><span>shape: </span> {specie?.shape.name}</div>}
                                    {specie?.habitat &&
                                        <div><span>habitat: </span> {specie?.habitat.name}</div>}
                                    {specie?.generation &&
                                        <div><span>habitat: </span> {specie?.generation.name}</div>}
                                    {specie?.color &&
                                        <div><span>color: </span> {specie?.color.name}</div>}

                                </div>
                                {specie?.varieties?.length > 1 &&
                                    <>
                                        <hr />
                                        <div className="moves">
                                            <section>
                                                <h1>Specie varieties:</h1>
                                                <div className="move-list">
                                                    {specie.varieties.map(variety => {
                                                        return (
                                                            <div key={variety?.pokemon?.name}>
                                                                <h2>{variety?.pokemon?.name}</h2>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </section>
                                        </div>
                                    </>
                                }{data?.held_items?.length > 0 &&
                                    <>
                                        <hr />
                                        <div className="moves">
                                            <section>
                                                <h1>held items:</h1>
                                                <p>Click on a move to see more informations in different versions.</p>
                                                <div className="move-list">
                                                    {data?.held_items?.map(held_item => {
                                                        return (
                                                            <div className={`${held_item.item.name === selectedItem?.item?.name ? "selected" : ""}`} onClick={() => setSelectedItem(held_item.item.name === selectedItem?.item?.name ? undefined : held_item)} key={held_item?.item.name}>
                                                                <h2>{held_item?.item?.name}</h2>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                                {selectedItem && <div className="move-informations">
                                                    {selectedItem?.version_details?.map(detail => {
                                                        return (
                                                            <div>
                                                                <p><span>Version:</span> {detail.version.name}</p>
                                                                <p><span>rarity:</span> {detail.rarity}</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>}
                                            </section>
                                        </div></>}
                                <hr />
                                <div className="moves">
                                    <section>
                                        <h1>Moves:</h1>
                                        <p>Click on a move to see more informations in different versions.</p>
                                        <div className="move-list">
                                            {moves.map(move => {
                                                return (
                                                    <div className={`${move.move.name === selectedMove?.move?.name ? "selected" : ""}`} onClick={() => setSelectedMove(move.move.name === selectedMove?.move?.name ? undefined : move)} key={move?.move?.name}>
                                                        <h2>{move?.move?.name}</h2>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        {selectedMove && <div className="move-informations">
                                            {selectedMove?.version_group_details?.map(moveDetails => {
                                                return (
                                                    <div>
                                                        <p><span>Version:</span> {moveDetails.version_group.name}</p>
                                                        <p><span>How to learn:</span> {moveDetails.move_learn_method.name}</p>
                                                        {moveDetails.level_learned_at > 0 &&
                                                            <p><span>Learned at level:</span> {moveDetails.level_learned_at}</p>}
                                                    </div>
                                                )
                                            })}
                                        </div>}
                                    </section>
                                </div>
                                <hr />
                                <div className="moves">
                                    <section>
                                        <h1>Abilities:</h1>
                                        <div className="move-list">
                                            {abilities.map(ability => {
                                                return (
                                                    <div key={ability?.ability?.name}>
                                                        <h2>{ability?.ability?.name}</h2>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </Outclick>
                </div>}


            <div className="pokemon-card">
                <div className="image" style={{ backgroundColor: `var(--${data.types[0].type.name}-light)` }}>
                    <div>
                        <span className="pokemon-type" style={{ backgroundColor: `var(--${data.types[0].type.name}-dark)` }}>
                            {data.types[0].type.name.charAt(0).toUpperCase() + data.types[0].type.name.slice(1)}
                        </span>
                    </div>
                    <img src={data.sprites.front_default} alt={data.name} />
                </div>
                <div className="card-info" style={{ backgroundColor: `var(--${data.types[0].type.name}-dark)` }}>
                    <h2>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
                    <button style={{ backgroundColor: `var(--${data.types[0].type.name}-light)` }} onClick={() => setShowMoreInfo(true)}>See Details</button>
                </div>
            </div>
        </>
    )
}

export default PokemonCardComponent