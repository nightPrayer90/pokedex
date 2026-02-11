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
const diagSpriteRef = document.getElementById("diag-pokemon-sprite");
const diagNameRef = document.getElementById("diag-pokemon-name");
const diagHeaderRef = document.getElementById("diag-header");
const diagDescriptionRef = document.getElementById("diag-description");
const diagWeightRef = document.getElementById("diag-weight");
const diagHeightRef = document.getElementById("diag-height");
const diagGeneraRef = document.getElementById("diag-genera");
const diagTypeBarRef = document.getElementById("diag-type-bar");

const diagEvoContainerRef = document.getElementById("diag-evo-container");
let lastScrollBoxRef = null;
//#endregion

// #region init
/** Initializes the event listeners for selecting images in the dialog using the arrow keys.*/
function init() {
    loadFirstPokemons();
}

async function loadFirstPokemons() {
    addEventKeyControls();
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

//#region dialog ----------------------------------------------------------------------------------
function openDialog(pokeID) {
    diagIndex = pokeID - 1;
    renderDialog(diagIndex);

    diagRef.showModal();
    isDialogOpen = true;

    closeBurgerMenu();
}

function closeDialogButton() {
    diagRef.close();
    isDialogOpen = false;
    lastScrollBoxRef.classList.remove("pokebox-loaded-select");
}

function tabDialogContentButtpn(tab) {
    changeClass("diag-content-tab-1", "diag-object-hide", true);
    changeClass("diag-content-tab-2", "diag-object-hide", true);
    changeClass("diag-content-tab-3", "diag-object-hide", true);
    changeClass("diag-content-tab-" + tab, "diag-object-hide", false);
}

function nextDialogPokemonButton() {
    if (!searchModeFlag) {
        if (diagIndex >= pokemons.length - 1) diagIndex = -1;
        diagIndex++;
    } else {
        index = findSearchIndex(diagIndex) + 1;
        if (index < searchArray.length) diagIndex = searchArray[index] - 1;
        else diagIndex = searchArray[0] - 1;
    }
    renderDialog();
}

function prevDialogPokemonButton() {
    if (!searchModeFlag) {
        if (diagIndex < 1) diagIndex = pokemons.length;
        diagIndex--;
    } else {
        index = findSearchIndex(diagIndex) - 1;
        if (index >= 0) diagIndex = searchArray[index] - 1;
        else diagIndex = searchArray[searchArray.length - 1] - 1;
    }
    renderDialog();
}

function renderDialog() {
    scrollToBox(diagIndex + 1);
    diagSpriteRef.src = pokemons[diagIndex].sprites;
    diagNameRef.innerText = "#" + pokemons[diagIndex].id + " - " + pokemons[diagIndex].name;
    removeTypeClasses(diagHeaderRef, "type-");
    changeClass("diag-header", "type-" + pokemons[diagIndex].types[0].name, true);

    //tab 1
    diagGeneraRef.innerText = pokemons[diagIndex].genera;
    diagDescriptionRef.innerText = pokemons[diagIndex].description;
    diagWeightRef.innerText = pokemons[diagIndex].weight;
    diagHeightRef.innerText = pokemons[diagIndex].height;
    
    // types
    let htmlString = `<img src="${wrapTypeToSprite(pokemons[diagIndex].types[0].name)}" alt=""></img>`;
    if (pokemons[diagIndex].types.length > 1)
        htmlString += `<img src="${wrapTypeToSprite(pokemons[diagIndex].types[1].name)}" alt=""></img>`;
    diagTypeBarRef.innerHTML = htmlString;
    
    //tab 2

    //tab 3
    diagEvoContainerRef.innerHTML = "";
    const evoLengh = Object.values(pokemons[diagIndex].evoList);
    for (const evo of evoLengh) {
        let evoClass = (evoLengh.length > 1) ? evo.gen : "max";
        evoClass = (evoLengh.length == 2) ? evo.gen+1 : evoClass;
        diagEvoContainerRef.innerHTML += /*html*/ `
            <div class="diag-gen-${evoClass}">
                <img src="${evo.sprite}" alt="">
                <div><span>${+evo.gen+1}</span></div>
            </div>
            `;
    }
}
//endregion
