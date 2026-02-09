// #region global fields
const pokemons = [];
const typeSprites = [];
const searchArray = [];

let maxLoadPokemonQuanitiy = 15;
const lastPokemonIndex = 1325;
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
    await loadPokemons(pokemons.length + 1);

    console.log(pokemons[0]);
}

async function loadPokemons(loadAt) {
    const loadUntil = Math.min(lastPokemonIndex, pokemons.length + maxLoadPokemonQuanitiy);
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
    hideLoadingSpinner();
}

//#region Button Functions ------------------------------------------------------------------------
function loadButton() {
    const buttonDivRef = document.getElementById("pokebox-load-more");
    if (buttonDivRef != null) buttonDivRef.remove();

    if (searchModeFlag) {
        searchMode(false, inputFieldPlaceholder);
        renderLoadedPokemon();
    }
    loadPokemons(pokemons.length + 1);

    closeBurgerMenu();
}

function loadMoreButton(ref) {
    const buttonDivRef = ref.parentElement;
    if (buttonDivRef != null) buttonDivRef.remove();
    loadPokemons(pokemons.length + 1);

    closeBurgerMenu();
}

async function searchButton(event) {
    event.preventDefault();

    const inputFieldRef = document.getElementById("searchField");
    buildSearchArray(inputFieldRef.value);

    if (inputFieldRef.value != "") {
        inputFieldRef.placeholder = inputFieldRef.value;
        searchMode(true, "[" + +searchArray.length + "] - " + inputFieldRef.value);
    } else {
        searchMode(false, inputFieldPlaceholder);
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

    let htmlString = "";
    // render type - images
    htmlString = `<div id="pokebox-type-${pokeID}" class="pokekebox-loaded-types">`;
    for (let i = 0; i < pokemons[pokeID - 1].types.length; i++) {
        const spriteUrl = wrapTypeToSprite(pokemons[pokeID - 1].types[i].name);
        htmlString += pokeboxTypeImage(spriteUrl);
    }
    htmlString += `</div>`;
    pokeboxRef.innerHTML += htmlString;

    if (pokemons[pokeID - 1].types.length == 2) {
        changeClass("pokebox-type-" + pokeID, "type-" + pokemons[pokeID - 1].types[1].name, true);
    }
}

function renderLoadCounter() {
    const conterRef = document.getElementById("header-loaded-pokemon");
    conterRef.innerText = pokemons.length;
}

function renderLoadedPokemon() {
    for (let i = 1; i <= pokemons.length; i++) {
        changeClass("pokebox-" + [i], "hide-object", false);
    }
}

/** Hide every rendered box, and then unhide all boxes form search array - it is much faster if i render all new */
function renderSearchArray() {
    for (let i = 1; i <= pokemons.length; i++) {
        changeClass("pokebox-" + [i], "hide-object", true);
    }

    for (let i = 0; i < searchArray.length; i++) {
        changeClass("pokebox-" + [searchArray[i]], "hide-object", false);
    }

    // TODO: DO Anything if we dont find a pokemon
}

//#endregion

//#region searchFunction --------------------------------------------------------------------------

// das search array ist eigentlich überflüssig auf diese art und weise?
function buildSearchArray(searchString) {
    searchArray.length = 0;

    //resetLoadingArea();

    for (let i = 0; i < pokemons.length; i++) {
        if (isSearchInString(pokemons[i].loolupName, searchString)) {
            let pokeID = pokemons[i].id;
            if (pokeID > 1025) pokeID = pokemons[i].id - 8975;

            searchArray.push(pokeID);
        }
    }

    renderSearchArray();
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
    searchMode(false, inputFieldPlaceholder);
    resetLoadingArea();
    loadPokemons(pokemons.length + 1);
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
