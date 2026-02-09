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

// eigentlich können wir hier den searchmodeFlag auch raus refactorn
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
