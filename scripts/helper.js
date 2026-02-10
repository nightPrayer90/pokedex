/**
 * General function for adding, removing, or toggling a class.
 */
function changeClass(elementID, className, control) {
    const elementRef = document.getElementById(elementID);
    switch (control) {
        case true:
            elementRef.classList.add(className);
            break;
        case false:
            elementRef.classList.remove(className);
            break;
    }
}

function toggleClass(elementID, className) {
    const elementRef = document.getElementById(elementID);
    elementRef.classList.toggle(className);
}

function wrapTypeToSprite(type) {
    let result = "./assets/svg/favicon.png";
    for (let i = 0; i < typeSprites.length; i++) {
        if (typeSprites[i].name == type) result = typeSprites[i].url;
    }
    return result;
}

function isSearchInString(lookUpString, searchString) {
    return lookUpString.toLowerCase().includes(searchString.toLowerCase());
}

function searchMode(isSearchMode, inputPlaceholder) {
    searchModeFlag = isSearchMode;
    const logoRef = document.getElementById("header-logo");
    logoRef.src = searchModeFlag ? "./assets/img/logo-search.png" : "./assets/img/logo.png";

    isSearchMode ? document.body.classList.add("body-search-color") : document.body.classList.remove("body-search-color");

    const inputFieldRef = document.getElementById("searchField");
    inputFieldRef.placeholder = inputPlaceholder;
}

function resetLoadingArea() {
    const renderAreaRef = document.getElementById("pokemon-loading-area");
    renderAreaRef.innerHTML = "";
}

function generationMapper(generation) {
    switch (generation) {
        case "generation-i":
            return 1;
        case "generation-ii":
            return 2;
        case "generation-iii":
            return 3;
        case "generation-iv":
            return 4;
        case "generation-v":
            return 5;
        case "generation-vi":
            return 6;
        case "generation-vii":
            return 7;
        case "generation-viii":
            return 8;
        case "generation-ix":
            return 9;
        default:
            return 0;
    }
}
