//#region dialog Button ---------------------------------------------------------------------------
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

function tabDialogContentButton(tab) {
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
//#endregion

//#region Render Dialog ---------------------------------------------------------------------------
function renderDialog() {
    scrollToBox(diagIndex + 1);
    renderDialogHeader();

    renderDialogInfoTab();
    renderDialogStatsTab();
    renderDialogEvoTab();

    renderDialogFooter();
}

function renderDialogHeader() {
    diagSpriteRef.src = pokemons[diagIndex].sprites;
    diagNameRef.innerText = "#" + pokemons[diagIndex].id + " - " + pokemons[diagIndex].name;
    removeTypeClasses(diagHeaderRef, "type-");
    changeClass("diag-header", "type-" + pokemons[diagIndex].types[0].name, true);
}

function renderDialogInfoTab() {
    diagGeneraRef.innerText = pokemons[diagIndex].genera;
    diagDescriptionRef.innerText = pokemons[diagIndex].description;
    diagWeightRef.innerText = pokemons[diagIndex].weight;
    diagHeightRef.innerText = pokemons[diagIndex].height;

    // types
    let htmlString = `<img src="${wrapTypeToSprite(pokemons[diagIndex].types[0].name)}" alt=""></img>`;
    if (pokemons[diagIndex].types.length > 1) htmlString += `<img src="${wrapTypeToSprite(pokemons[diagIndex].types[1].name)}" alt=""></img>`;
    diagTypeBarRef.innerHTML = htmlString;
}

function renderDialogStatsTab() {
    diagATKRef.style.width = Math.round((100 * pokemons[diagIndex].stats.attack) / maxATK) + "%";
    diagATKvalueRef.innerText = pokemons[diagIndex].stats.attack;
    diagDEFRef.style.width = Math.round((100 * pokemons[diagIndex].stats.defense) / maxDEF) + "%";
    diagDEFvalueRef.innerText = pokemons[diagIndex].stats.defense;
    diagHPRef.style.width = Math.round((100 * pokemons[diagIndex].stats.hp) / maxHP) + "%";
    diagHPvalueRef.innerText = pokemons[diagIndex].stats.hp;
    diagSATKRef.style.width = Math.round((100 * pokemons[diagIndex].stats["special-attack"]) / maxSATK) + "%";
    diagSATKvalueRef.innerText = pokemons[diagIndex].stats["special-attack"];
    diagSDEFRef.style.width = Math.round((100 * pokemons[diagIndex].stats["special-defense"]) / maxSDEF) + "%";
    diagSDEFvalueRef.innerText = pokemons[diagIndex].stats["special-defense"];
    diagSPDRef.style.width = Math.round((100 * pokemons[diagIndex].stats.speed) / maxSPD) + "%";
    diagSPDvalueRef.innerText = pokemons[diagIndex].stats.speed;
}

function renderDialogEvoTab() {
    diagEvoContainerRef.innerHTML = "";
    const evoLengh = Object.values(pokemons[diagIndex].evoList);
    for (const evo of evoLengh) {
        let evoClass = evoLengh.length > 1 ? evo.gen : "max";
        evoClass = evoLengh.length == 2 ? evo.gen + 1 : evoClass;
        diagEvoContainerRef.innerHTML += /*html*/ `
            <div class="diag-gen-${evoClass}">
                <img src="${evo.sprite}" alt="">
                <div><span>${+evo.gen + 1}</span></div>
            </div>
            `;
    }
}

function renderDialogFooter() {
    diagGenerationRef.innerText = generationMapper(pokemons[diagIndex].generation);
}
//endregion
