async function getPokemon(id) {
    try {
        const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (pokemon.ok == false) throw new Error("pokemon");
        const pokemonData = await pokemon.json();

        const species = await fetch(pokemonData.species.url);
        if (species.ok == false) throw new Error("species");

        const speciesData = await species.json();

        const evolution = await fetch(speciesData.evolution_chain.url);
        if (evolution.ok == false) throw new Error("evolution");

        const evolutionData = await evolution.json();

        return buildPokemonObject(pokemonData, speciesData, evolutionData);
    } catch (fetchError) {
        console.error("[failed to fetch:" + id + "] " + fetchError);
        return null;
    }
}

async function buildPokemonObject(pokemonData, speciesData, evolutionData) {
    return {
        id: pokemonData.id,
        name: findLanguageEntry(speciesData.names, "name"),
        loolupName: "#"+pokemonData.id + " " + findLanguageEntry(speciesData.names, "name"), 
        description: findLanguageEntry(speciesData.flavor_text_entries, "flavor_text"),
        genera: findLanguageEntry(speciesData.genera, "genus"),
        generation: speciesData.generation.name,
        sprites: pokemonData.sprites.other["official-artwork"].front_default,
        height: pokemonData.height,
        weight: pokemonData.weight,
        stats: statsToObject(pokemonData.stats),
        types: typesToArray(pokemonData.types),
        evoList: await buildChainObject(evolutionData.chain),
    };
}

function findLanguageEntry(entries, field) {
    for (let i = 0; i < entries.length; i++) {
        if (entries[i].language.name === loadingLanguage) {
            return entries[i][field]; 
        }
    }
    return null;
}

//** rebuild the statsData to a new object */
function statsToObject(statsArray) {
    const result = {};

    for (let i = 0; i < statsArray.length; i++) {
        let entry = statsArray[i];
        if (entry == null || entry.stat == null) continue;
        result[entry.stat.name] = entry.base_stat;
    }
    return result;
}

function typesToArray(typsArray) {
    const result = [];

    for (let i = 0; i < typsArray.length; i++) {
        let entry = typsArray[i];
        if (entry == null || entry.type == null) continue;

        let object = { name: entry.type.name };
        result.push(object);
    }
    return result;
}

// TODO: -> Sprites nicht über Name sondern über ID -> name ist nicht valide 
async function buildChainObject(chainObject) {
    const result = {};

    // base
    result[chainObject.species.name] = {
        name: chainObject.species.name,
        gen: 0,
        sprite: await fetchEvoSprites(chainObject.species.url),
    };

    if (chainObject.evolves_to.length != null) {
        for (let i = 0; i < chainObject.evolves_to.length; i++) {
            const entryGen1 = chainObject.evolves_to[i];

            result[entryGen1.species.name] = {
                name: entryGen1.species.name,
                gen: 1,
                sprite: await fetchEvoSprites(entryGen1.species.url),
            };

            if (entryGen1.evolves_to.length != null) {
                for (let j = 0; j < entryGen1.evolves_to.length; j++) {
                    const entryGen2 = entryGen1.evolves_to[j];

                    result[entryGen2.species.name] = {
                        name: entryGen2.species.name,
                        gen: 2,
                        sprite: await fetchEvoSprites(entryGen2.species.url),
                    };
                }
            }
        }
    }
    return result;
}

async function fetchEvoSprites(url) {
    try {
        const species = await fetch(url);
        if (species.ok == false) throw new Error(url);
        const speciesData = await species.json();

        const pokemon = await  fetch("https://pokeapi.co/api/v2/pokemon/" + speciesData.id + "/");
        if (pokemon.ok == false) throw new Error("https://pokeapi.co/api/v2/pokemon/" + speciesData.id + "/");
        const pokemonData = await pokemon.json();
        
        return pokemonData.sprites.other.showdown.front_default;

    } catch (fetchError) {
        console.warn("[sprite load failed: ]" +  fetchError);
        return "";
    }
}

async function fetchTypeSprites() {
    try {
        const types = await fetch(`https://pokeapi.co/api/v2/type/`);
        if (types.ok == false) throw new Error("[failed to fetch types]");
        const typesData = await types.json();

        for (let i = 0; i < typesData.results.length; i++) {
            const type = await fetch(typesData.results[i].url);
            if (type.ok == false) throw new Error("[failed to fetch types]");
            const typeData = await type.json();

            typeSprites.push({
                name: typeData.name,
                typeId: typeData.id,
                url: typeData.sprites["generation-viii"]["sword-shield"].name_icon,

            });
        }
    } catch (fetchError) {
        console.error(fetchError);
    }
}
