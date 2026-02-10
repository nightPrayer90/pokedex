function pokeboxTemplate(pokeID) {
    return /*html*/ `
        <div id="pokebox-${pokeID}" class="pokebox pokebox-placeholder">
        </div>
    `;
}

function pokeboxContent(pokeID, generation) {
    return /*html*/ `
    <div class ="pokebox-header-container">
        <h2>#${pokemons[pokeID - 1].id} - ${pokemons[pokeID - 1].name}</h2>
    </div>
    <div class ="pokebox-sprite-container">
        <div class ="pokebox-sprite-box">
            <img class ="pokebox-sprite" src=${pokemons[pokeID - 1].sprites} alt="">
             <div class="pokebox-generation">
                <p>${generation}</p>
            </div>
        </div>
    </div>
    `;
}

function pokeboxTypeImage(url) {
    return /*html*/ `
        <img class ="pokebox-type" src=${url} alt="">
    `;
}

function pokeboxLoadMoreTemplate() {
    return /*html*/ `
        <div id="pokebox-load-more" class="pokebox">
            <button onclick="loadMoreButton(this)">
            <p>+</p>
            </button>
        </div>
    `;
}
