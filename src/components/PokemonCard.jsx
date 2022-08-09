import { useEffect, useState } from "react"

function PokemonCardComponent({ data }) {

    const [showMoreInfo, setShowMoreInfo] = useState(false)

    useEffect(() => {
        document.body.style.overflowY = showMoreInfo ? "hidden" : "auto";
    }, [showMoreInfo])

    return (
        <>
            {showMoreInfo &&
                <div className="full-screen-background" onClick={() => setShowMoreInfo(false)}>
                    <div className="pokemon-info-panel">
                        <div className="panel-header" style={{ backgroundColor: `var(--${data.types[0].type.name}-dark)` }}>
                            <h1>{data.name}</h1>
                        </div>
                        <div className="panel-body">
                            <div className="general-info">
                                <div className="images">
                                    <img src={data.sprites.front_default} alt={data.name} />
                                </div>
                                <div className="stats">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            <div className="pokemon-card">
                <div className="image" style={{ backgroundColor: `var(--${data.types[0].type.name}-light)` }}>
                    <div>
                        <span style={{ backgroundColor: `var(--${data.types[0].type.name}-dark)` }}>
                            {data.types[0].type.name.charAt(0).toUpperCase() + data.types[0].type.name.slice(1)}
                        </span>
                    </div>
                    <img src={data.sprites.front_default} alt={data.name} />
                </div>
                <div className="card-info" style={{ backgroundColor: `var(--${data.types[0].type.name}-dark)` }}>
                    <h2>{data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
                    <button style={{ backgroundColor: `var(--${data.types[0].type.name}-light)` }} onClick={() => setShowMoreInfo(true)}>Ver detalhes</button>
                </div>
            </div>
        </>
    )
}

export default PokemonCardComponent