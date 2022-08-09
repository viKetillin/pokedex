function PokemonCardComponent({ data }) {
    return (
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
            </div>
        </div>
    )
}

export default PokemonCardComponent