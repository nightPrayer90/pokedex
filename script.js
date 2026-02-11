// #region global fields
const logoRef = document.getElementById("header-logo");
const reloadRef = document.getElementById("header-render-button");
const inputFieldRef = document.getElementById("searchField");
const renderAreaRef = document.getElementById("pokemon-loading-area");
const diagRef = document.getElementById("diag-root");
const conterRef = document.getElementById("header-loaded-pokemon");

const pokemons = [];
const typeSprites = [];
const searchArray = [];

const lastPokemonIndex = 1325;
const inputFieldPlaceholder = "search #number or string";

let maxLoadPokemonQuanitiy = 15;
let loadingLanguage = "de";

let searchModeFlag = false;
let isDialogOpen = false; //maybe i dont need it
let diagIndex = 0;
let lastScrollBoxRef = null;

// diag tab 1
const diagSpriteRef = document.getElementById("diag-pokemon-sprite");
const diagNameRef = document.getElementById("diag-pokemon-name");
const diagHeaderRef = document.getElementById("diag-header");
const diagDescriptionRef = document.getElementById("diag-description");
const diagWeightRef = document.getElementById("diag-weight");
const diagHeightRef = document.getElementById("diag-height");
const diagGeneraRef = document.getElementById("diag-genera");
const diagTypeBarRef = document.getElementById("diag-type-bar");

// diag tab 2
const maxATK = 190;
const maxDEF = 230;
const maxHP = 255;
const maxSATK = 194;
const maxSDEF = 230;
const maxSPD = 200;

const diagATKRef = document.getElementById("diag-statsbar-ATK");
const diagATKvalueRef = document.getElementById("diag-statsbar-value-ATK");
const diagDEFRef = document.getElementById("diag-statsbar-DEF");
const diagDEFvalueRef = document.getElementById("diag-statsbar-value-DEF");
const diagHPRef = document.getElementById("diag-statsbar-HP");
const diagHPvalueRef = document.getElementById("diag-statsbar-value-HP");
const diagSATKRef = document.getElementById("diag-statsbar-SATK");
const diagSATKvalueRef = document.getElementById("diag-statsbar-value-SATK");
const diagSDEFRef = document.getElementById("diag-statsbar-SDEF");
const diagSDEFvalueRef = document.getElementById("diag-statsbar-value-SDEF");
const diagSPDRef = document.getElementById("diag-statsbar-SPD");
const diagSPDvalueRef = document.getElementById("diag-statsbar-value-SPD");

// diag tab 3
const diagEvoContainerRef = document.getElementById("diag-evo-container");

// footer
const diagGenerationRef = document.getElementById("diag-generation");
//#endregion

// #region init
/** Initializes the event listeners for selecting images in the dialog using the arrow keys.*/
function init() {
    loadFirstPokemons();
}

async function loadFirstPokemons() {
    addEventKeyControls();
    addEventCloseBackdropClick();
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

/** add EventListeners for key controls  */
function addEventKeyControls() {
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            if (isDialogOpen == true) {
                event.preventDefault();
                prevDialogPokemonButton();
            }
        } else if (event.key === "ArrowRight") {
            if (isDialogOpen == true) {
                event.preventDefault();
                nextDialogPokemonButton();
            }
        } else if (event.key === "Escape") {
            if (isDialogOpen == true) {
                event.preventDefault();
                closeDialogButton();
            }
        }
    });
}

/**logic for backdrop close */
function addEventCloseBackdropClick() {
    //
    const dialog = document.getElementById("diag-root");
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeDialogButton();
        }
    });
}

//#endregion

//#region Button Functions ------------------------------------------------------------------------
function loadButton() {
    if (searchModeFlag) {
        showLoadingSpinner();
        searchMode(false, inputFieldPlaceholder);
        renderLoadedPokemon();
    }
    loadPokemons(pokemons.length + 1);

    closeBurgerMenu();
}

function exitSearchButton(event) {
    console.log("klick");
    event.preventDefault();
    searchMode(false, inputFieldPlaceholder);
    renderLoadedPokemon();

    closeBurgerMenu();
}

async function searchButton(event) {
    event.preventDefault();

    buildSearchArray(inputFieldRef.value);
    renderSearchArray();

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
        renderAreaRef.innerHTML += pokeboxTemplate(pokeID);
    } else {
        changeClass("pokebox-" + pokeID, "pokebox-placeholder", false);
        changeClass("pokebox-" + pokeID, "pokebox-loaded", true);

        const pokeboxRef = document.getElementById("pokebox-" + pokeID);
        const generationID = generationMapper(pokemons[pokeID - 1].generation);
        pokeboxRef.innerHTML = pokeboxContent(pokeID, generationID);

        renderPokeBoxType(pokeboxRef, pokeID);
        conterRef.innerText = pokemons.length;
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

function renderLoadedPokemon() {
    for (let i = 1; i <= pokemons.length; i++) {
        changeClass("pokebox-" + [i], "hide-object", false);
    }
}

function buildSearchArray(searchString) {
    searchArray.length = 0;

    for (let i = 0; i < pokemons.length; i++) {
        if (isSearchInString(pokemons[i].loolupName, searchString)) {
            let pokeID = pokemons[i].id;
            if (pokeID > 1025) pokeID = pokemons[i].id - 8975;

            searchArray.push(pokeID);
        }
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

// #region Settings - burger menus ----------------------------------------------------------------
function toggleBurger(menu) {
    if (menu == "burger-menu-quantity") changeClass("burger-menu-language", "open", false);
    else changeClass("burger-menu-quantity", "open", false);
    toggleClass(menu, "open");
}

function chooseBurgerLanguage(language) {
    loadingLanguage = language;
    closeBurgerMenu();
    const textRef = document.getElementById("language-setting");
    textRef.innerText = language;

    pokemons.length = 0;
    searchMode(false, inputFieldPlaceholder);

    renderAreaRef.innerHTML = "";
    loadPokemons(pokemons.length + 1);
}

function chooseBurgerQuantity(quantity) {
    maxLoadPokemonQuanitiy = quantity;
    closeBurgerMenu();
    const textRef = document.getElementById("quantity-setting");
    textRef.innerText = quantity;
}

function closeBurgerMenu() {
    changeClass("burger-menu-language", "open", false);
    changeClass("burger-menu-quantity", "open", false);
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

