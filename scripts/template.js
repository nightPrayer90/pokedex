function pokeboxTemplate(pokeID) {
    return /*html*/ `
        <div id="pokebox-${pokeID}" class="pokebox pokebox-placeholder">
        </div>
    `;
}

function pokeboxContent(pokeID) {
    return /*html*/ `
    <div>
        <h2>#${pokemons[pokeID-1].id} - ${pokemons[pokeID-1].name}</h2>
        <img class ="pokebox-sprite" src=${pokemons[pokeID-1].sprites} alt="">
    </div>
 `;
}


function pokeboxTypeImage(url) {
    return /*html*/ `
    <div>
        <img class ="pokebox-type" src=${url} alt="">
    </div>
 `;
}

function pokeboxLoadMoreTemplate() {
    return /*html*/ `
        <div id="pokebox-load-more" class="pokebox load-more">
            <button onclick="loadMoreButton(this)">
            <p>+</p>
            </button>
        </div>
    `;
}
