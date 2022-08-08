function PokemonCardComponent({ data }) {
    return (
        <div>
            <img src={data.sprites.front_default} alt={data.species.name} />
        </div>
    )
}

export default PokemonCardComponent