// #region global fields
const pokemons = [];
const typeSprites = [];
const searchArray = [];

let maxLoadPokemonQuanitiy = 15;
let loadingLanguage = "de";
let searchModeFlag = false;
const inputFieldPlaceholder = "search #number or string";
//#endregion

// #region init
/** Initializes the event listeners for selecting images in the dialog using the arrow keys.*/
function init() {
    loadFirstPokemons();
}

async function loadFirstPokemons() {
    showLoadingSpinner();
    await fetchTypeSprites();
    await loadPokemons(pokemons.length+1);

    console.log(pokemons[0]);
}

async function loadPokemons(loadAt) {
    const loadUntil = pokemons.length + maxLoadPokemonQuanitiy;
    console.log("maxLoadPokemonQuanitiy " + maxLoadPokemonQuanitiy);

    showLoadingSpinner();

    // render empty preload boxes
    for (let i = loadAt; i <= loadUntil; i++) {
        renderPokeBoxLoad(i, true);
    }

    // fill the boxes
    for (let i = loadAt; i <= loadUntil; i++) {
        let pokemon = await getPokemon(i);
        pokemons.push(pokemon);

        renderPokeBoxLoad(i, false);
    }

    // render loading box
    renderLoadMoreButton();

    hideLoadingSpinner();
}

//#region Button Functions ------------------------------------------------------------------------
async function loadButton() {
    const buttonDivRef = document.getElementById("pokebox-load-more");
    if (buttonDivRef != null) buttonDivRef.remove();

    if (searchModeFlag) {
        searchMode(false, inputFieldPlaceholder);
        renderLoadedPokemon();
        loadPokemons(pokemons.length+1);
        // hier müssen wir nochmal die gesamte liste laden!
    } else {
        loadPokemons(pokemons.length + 1);
    }

    closeBurgerMenu();
}

function loadMoreButton(ref) {
    const buttonDivRef = ref.parentElement;
    if (buttonDivRef != null) buttonDivRef.remove();
    loadPokemons(pokemons.length + 1);

    closeBurgerMenu();
}

function searchButton(event) {
    event.preventDefault();

    const inputFieldRef = document.getElementById("searchField");
    buildSearchArray(inputFieldRef.value);

    if (inputFieldRef.value != "") {
        inputFieldRef.placeholder = inputFieldRef.value;
        searchMode(true, inputFieldRef.value);
    } else {
        searchMode(false, inputFieldPlaceholder);
        renderLoadMoreButton();
    }

    inputFieldRef.value = "";
    closeBurgerMenu();
}
//#endregion

//#region Render Functions ------------------------------------------------------------------------
function renderPokeBoxLoad(pokeID, isLoading) {
    if (isLoading == true) {
        const renderAreaRef = document.getElementById("pokemon-loading-area");
        renderAreaRef.innerHTML += pokeboxTemplate(pokeID);
    } else {
        changeClass("pokebox-" + pokeID, "pokebox-placeholder", false);
        changeClass("pokebox-" + pokeID, "pokebox-loaded", true);

        const pokeboxRef = document.getElementById("pokebox-" + pokeID);
        pokeboxRef.innerHTML = pokeboxContent(pokeID);

        renderPokeBoxType(pokeboxRef, pokeID);
        renderLoadCounter();
    }
}

function renderPokeBoxType(pokeboxRef, pokeID) {
    // box bk color
    changeClass("pokebox-" + pokeID, "type-" + pokemons[pokeID - 1].types[0].name, true);

    // render type - images
    for (let i = 0; i < pokemons[pokeID - 1].types.length; i++) {
        const spriteUrl = wrapTypeToSprite(pokemons[pokeID - 1].types[i].name);
        pokeboxRef.innerHTML += pokeboxTypeImage(spriteUrl);
    }
}

function renderLoadMoreButton() {
    const renderAreaRef = document.getElementById("pokemon-loading-area");
    renderAreaRef.innerHTML += pokeboxLoadMoreTemplate();
}

function renderLoadCounter() {
    const conterRef = document.getElementById("header-loaded-pokemon");
    conterRef.innerText = pokemons.length;
}

function renderLoadedPokemon() {
    resetLoadingArea();

    for (let i = 0; i < pokemons.length-1; i++) {
            renderPokeBoxLoad(pokemons[i].id, true);
            renderPokeBoxLoad(pokemons[i].id, false);
    }
}

//#endregion

//#region searchFunction --------------------------------------------------------------------------

// das search array ist eigentlich überflüssig auf diese art und weise?
function buildSearchArray(searchString) {
    searchArray.length = 0;

    resetLoadingArea();

    for (let i = 0; i < pokemons.length; i++) {
        if (isSearchInString(pokemons[i].loolupName, searchString)) {
            searchArray.push(pokemons[i].id);
            renderPokeBoxLoad(searchArray.at(-1), true);
            renderPokeBoxLoad(searchArray.at(-1), false);
        }
    }

    // TODO: DO Anything if we dont find a pokemon
}
//#endregion

// #region Settings - burger menus ----------------------------------------------------------------
function toggleBurger(menu) {
    closeBurgerMenu();
    toggleClass(menu, "open");
}

function closeBurgerMenu() {
    changeClass("burger-menu-language", "open", false);
    changeClass("burger-menu-quantity", "open", false);
}

function chooseBurgerLanguage(language) {
    loadingLanguage = language;
    closeBurgerMenu();
    const textRef = document.getElementById("language-setting");
    textRef.innerText = language;

    pokemons.length = 0;
    searchMode(false, inputFieldPlaceholder)
    resetLoadingArea();
    loadPokemons(pokemons.length+1);
}

function chooseBurgerQuantity(quantity) {
    maxLoadPokemonQuanitiy = quantity;
    closeBurgerMenu();
    const textRef = document.getElementById("quantity-setting");
    textRef.innerText = quantity;
}

//#endregion

//#region loading Spinner -------------------------------------------------------------------------
function showLoadingSpinner() {
    changeClass("loader-container", "hide-object", false);
    changeClass("header-logo", "spin-animation", true);
}

function hideLoadingSpinner() {
    changeClass("loader-container", "hide-object", true);
    changeClass("header-logo", "spin-animation", false);
}
//#endregion
