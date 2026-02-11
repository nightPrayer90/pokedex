/**
 * JS for helper functions
 * ------------------------------------------------------------------------------------------------ 
*/

/** Function for adding or removing css classes. @param(elementID) is a string */
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

/** Function for toggle css classes. 
 * @param {string} elementID
 * @param {string} className
 * */
function toggleClass(elementID, className) {
    const elementRef = document.getElementById(elementID);
    elementRef.classList.toggle(className);
}

/** Function only for remove css classes.
 * use this for type-classes in dialog header 
 * @param {object reference} elemet
 * */
function removeTypeClasses(elemet, clsString) {
    elemet.classList.forEach((cls) => {
        if (cls.startsWith(clsString)) {
            elemet.classList.remove(cls);
        }
    });
}

/** Returns the correct sprite URL for pokemon type 
* @param {string} type - the source type as string.
* @returns {string} typ-sprite-url.
*/
function wrapTypeToSprite(type) {
    let result = "./assets/svg/favicon.png";
    for (let i = 0; i < typeSprites.length; i++) {
        if (typeSprites[i].name == type) result = typeSprites[i].url;
    }
    return result;
}

/**
 * Performs a case-insensitive substring check.
 * Converts both strings to lowercase before comparing.
 * @param {string} lookUpString - The source string.
 * @param {string} searchString - The substring to look for.
 * @returns {boolean} True if the substring exists, otherwise false.
 */
function isSearchInString(lookUpString, searchString) {
    return lookUpString.toLowerCase().includes(searchString.toLowerCase());
}

/**
 * This function manages the activation and deactivation of search mode. 
 * It also manages all related changes to CSS classes. 
 * The only function that changes the searchModeFlag.
 * @param {boolean} isSearchMode 
 * @param {string} inputPlaceholder 
 */
function searchMode(isSearchMode, inputPlaceholder) {

    searchModeFlag = isSearchMode;

    reloadRef.disabled = !isSearchMode;
    logoRef.src = searchModeFlag ? "./assets/img/logo-search.png" : "./assets/img/logo.png";
    isSearchMode ? document.body.classList.add("body-search-color") : document.body.classList.remove("body-search-color");
    
    inputFieldRef.value = "";
    inputFieldRef.placeholder = inputPlaceholder;  
}

/** 
 * maps the generation string from the pokemon object to a number 
 * @param {string} generation 
 * @returns {number} 0 as fallback
 */
function generationMapper(generation) {
    switch (generation) {
        case "generation-i": return 1;
        case "generation-ii": return 2;
        case "generation-iii": return 3;
        case "generation-iv": return 4;
        case "generation-v": return 5;
        case "generation-vi": return 6;
        case "generation-vii": return 7;
        case "generation-viii": return 8;
        case "generation-ix": return 9;
        default: return 0;
    }
}

/** 
 * Returns the position of the incoming ID in the search array. 
 * @param {string} generation 
 * @returns {number} -1 as fallback
 */
function findSearchIndex(searchID) {
    searchID++;
    for (let i = 0; i < searchArray.length; i++) {
        if (searchID === searchArray[i]) return i;
    }
    return -1;
}

/** 
 * When changing the Pokémon in the dialog, we move along with the corresponding boxes. 
 * The function marks the box and scrolls along with it.  
 * * @param {number} diagIndex number of the selected Pokebox
 * */
function scrollToBox(diagIndex) {
    const boxRef = document.getElementById("pokebox-" + diagIndex);
    boxRef.scrollIntoView({ block: "center" });
    markPokebox(boxRef);
}

/**
 * This function selects the box we have just selected in the dialog 
 * and resets the selection of the last box.
 * @param {object} boxRef reference of the selected box
 */
function markPokebox(boxRef) {
    if (lastScrollBoxRef != null) lastScrollBoxRef.classList.remove("pokebox-loaded-select");
    boxRef.classList.add("pokebox-loaded-select");
    lastScrollBoxRef = boxRef;
}
