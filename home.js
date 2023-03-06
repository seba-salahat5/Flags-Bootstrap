async function initial(rowId, searchFieldId, menuID, dropTargetId) {
    let APIUrl = 'https://restcountries.com/v3.1';
    let countries = [];
    let selectedRegion = 'No Filter';
    let inputStr = '';
    searchEvent(searchFieldId, inputStr, async (inputStr) => {
        loadCountries(APIUrl, inputStr).then(res => {
            let favouratesList = getFromLocalStorage('favouratesList');
            countries = res.filter(country => country.region == selectedRegion
                || selectedRegion == 'No Filter'
                || (selectedRegion == 'Favourites' && favouratesList.some((element) => element.cca2 == country.cca2)));
            displayCountries(rowId, countries, dropTargetId, () => {
                applyMode();
                fillStar();
            });
        });
    });
    selectFilter(menuID, selectedRegion, (filter) => {
        let favouratesList = getFromLocalStorage('favouratesList');
        let filteredCountries = [];
        selectedRegion = filter;
        selectedRegion == 'Favourites'
            ? filteredCountries = favouratesList
            : filteredCountries = countries.filter(country => country.region == selectedRegion || selectedRegion == 'No Filter');
        displayCountries(rowId, filteredCountries, dropTargetId, () => {
            applyMode();
            fillStar();
        });
    });
    try {
        let response = await fetch(`${APIUrl}/all`);
        if (!response.ok) {
            throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        let responseData = await response.json();
        for (let country of responseData) {
            countries.push(country);
        }
        displayCountries(rowId, countries, dropTargetId, () => {
            applyMode();
            fillStar();
            displayFavourateList(dropTargetId);
        });
    } catch (e) {
        console.log(e);
    }
}
function displayFavourateList(dropTargetId) {
    let favouratesList = getFromLocalStorage('favouratesList');
    let favouratesDiv = document.getElementById(dropTargetId);
    let innerDiv = favouratesDiv.lastChild;
    let newDiv = document.createElement('div');
    if (favouratesList) {
        for (let favourateItem of favouratesList) {
            newDiv.appendChild(createFavouriteItem(favourateItem));
        }
    }
    favouratesDiv.removeChild(innerDiv);
    favouratesDiv.appendChild(newDiv);
}
function displayCountries(rowId, fetchedCountries, dropTargetId, cb) {
    let currentRow = document.getElementById(rowId);
    let parentElement = currentRow.parentNode;
    let newRow = createRow(rowId);
    if (fetchedCountries.length == 0) {
        let msg = document.createElement('h5');
        msg.setAttribute('class', 'card-title text-start fw-bold');
        msg.innerText = 'No results Found';
        newRow.appendChild(msg);
        parentElement.removeChild(currentRow);
        parentElement.appendChild(newRow);
        return;
    }
    if (!fetchedCountries) {
        return;
    }
    for (let country of fetchedCountries) {
        newRow.appendChild(createColumn(country, dropTargetId));
    }
    parentElement.removeChild(currentRow);
    parentElement.appendChild(newRow);
    cb();
}
function selectFilter(listId, selectedRegion, cb) {
    let items = document.querySelectorAll(listId);
    for (let i = 0; i < items.length; i++) {
        items[i].onclick = function () {
            selectedRegion = this.innerHTML;
            cb(selectedRegion);
        };
    }
}
function searchEvent(searchFieldId, inputStr, cb) {
    let searchTextField = document.getElementById(`${searchFieldId}`);
    searchTextField.addEventListener('keyup', async (e) => {
        let delay = 1000;
        clearTimeout(delay);
        delay = setTimeout(() => {
            inputStr = e.target.value ?? '';
            cb(inputStr);
        }, delay);
    });
}
async function loadCountries(APIUrl, searchValue) {
    let url = '';
    searchValue == '' ? url = `${APIUrl}/all` : url = `${APIUrl}/name/${searchValue}`;
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch countries: ${response.status}`);
    }
    return response.json();
    /*try {
        currentRequests.forEach(request => {
            request.abort();
            const index = currentRequests.findIndex(request);
            currentRequests.splice(index, 1);
        });
        let controller = new AbortController();
        let {signal} = controller;
        currentRequests.push(controller);
    } catch (e) {
        console.log(e);
    }*/
}
function DisplayDetails(countryCode) {
    let parameter = new URLSearchParams();
    parameter.append("countryCode", `${countryCode}`);
    location.href = "https://seba-salahat5.github.io/Flags-Bootstrap/details?" + parameter.toString();

}
function initializeTarget(draggedElement, dropTargetId) {
    const target = document.getElementById(dropTargetId);
    target.addEventListener("dragover", (event) => {
        event.target.style.border = "2px solid transparent";
        event.target.style.borderColor = "#27ae60";
        event.preventDefault();
    });
    target.addEventListener("dragleave", (event) => {
        event.target.style.border = "2px solid transparent";
        event.preventDefault();
    });
    target.addEventListener("drop", (event) => {
        let favouratesList = getFromLocalStorage('favouratesList');
        addToFavourate(draggedElement.country, () => { });
        if (!favouratesList.some((element) => element.cca2 == draggedElement.country.cca2)) {
            event.preventDefault();
            if (event.target.id == dropTargetId) {
                event.target.appendChild(createFavouriteItem(draggedElement.country));
                event.target.style.border = "2px solid transparent";
            }
        }
    });
}
function addToFavourate(country, cb) {
    let favouratesList = getFromLocalStorage('favouratesList');
    if (!favouratesList) {
        favouratesList = [];
    }
    if (!favouratesList.some((element) => element.cca2 == country.cca2)) {
        favouratesList.push(country);
        setInLocalStorage('favouratesList', favouratesList);
        cb()
    }
}
function removeFromFavouritesBar(countryToRemove, spanId) {
    removeCountryFromList(countryToRemove, () => { });
    let favourteItem = document.getElementById(spanId);
    favourteItem.parentNode.removeChild(favourteItem);
}
function removeCountryFromList(countryToRemove, cb) {
    let favouratesList = getFromLocalStorage('favouratesList');
    const index = favouratesList.findIndex((country) => country.cca2 == countryToRemove);
    favouratesList.splice(index, 1);
    setInLocalStorage('favouratesList', favouratesList);
    cb();
}
// *********************************************** Local Storage Functions **********************************************
function setInLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
        localStorageValue = { key: key, value: value };
    }
}
function getFromLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        return localStorageValue;
    }
}
// *********************************************** Dark Mode Functions ***************************************************
function switchMode() {
    let darkMode = getFromLocalStorage('darkMode');
    darkMode = !darkMode;
    setInLocalStorage('darkMode', darkMode);
    applyMode();
}
function applyMode() {
    let darkModeStatus = getFromLocalStorage('darkMode');
    let body = document.body;
    let elements = document.querySelectorAll(".white");
    let cssRoot = document.querySelector(':root');
    let cssValues = getComputedStyle(cssRoot);
    document.getElementById("btn").innerHTML = "Dark Mode";

    bgColor = cssValues.getPropertyValue('--light_mode_element_bg');
    fontColor = cssValues.getPropertyValue('--light_mode_font_color');
    body.style.backgroundColor = cssValues.getPropertyValue('--light_mode_bg');
    body.style.color = cssValues.getPropertyValue('--light_mode_font_color');

    if (darkModeStatus) {
        document.getElementById("btn").innerHTML = "Light Mode";
        body.style.backgroundColor = cssValues.getPropertyValue('--dark_mode_bg');
        body.style.color = cssValues.getPropertyValue('--dark_mode_font_color');
        bgColor = cssValues.getPropertyValue('--dark_mode_element_bg');
        fontColor = cssValues.getPropertyValue('--dark_mode_font_color');
    }
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = bgColor;
        elements[i].style.color = fontColor;
    }
}
// *********************************************** View Functions *******************************************************
function createRow(rowId) {
    let row = document.createElement('div');
    row.setAttribute('class', 'row row-cols-lg-3 row-cols-md-2  row-cols-sm-2 row-cols-1 g-5');
    row.setAttribute('id', `${rowId}`);
    return row;
}
function createColumn(country, dropTargetId) {
    let countryStr = JSON.stringify(country);
    countryStr = countryStr.replaceAll('"', "'");
    let column = document.createElement('div');
    column.setAttribute('class', 'col');
    column.setAttribute('draggable', "true");
    column.setAttribute('id', "draggable");
    column.addEventListener("dragstart", (event) => {
        column.style.opacity = '0.5';
        let draggedElement = { event: event.target, country: country };
        initializeTarget(draggedElement, dropTargetId);
    });
    column.addEventListener("dragend", (event) => {
        column.style.opacity = '1';
    });
    column.innerHTML = `
    <div class="card h-100 white">
        <div onclick = "DisplayDetails('${country.cca2}')">
            <img class="card-img-top" src=${country.flags.svg} alt=${country.name.common}>
            <div class="card-body" id="${country.name.common}">
                <h5 class="card-title text-start fw-bold">${country.name.common}</h5>
                <h6><span class="fw-bold">Population: </span><span>${country.population}</sapn></h6>
                <h6><span class="fw-bold">Region: </span><span>${country.region}</sapn></h6>
                <h6><span class="fw-bold">Capital: </span><span>${country.capital}</sapn></h6>
            </div>
        </div>
        <div class="d-none d-sm-flex d-lg-none flex-row-reverse py-2 px-2">
            <i class="fa-regular fa-star" id="${country.cca2}-starIcon" onclick= "changeIcon(this,${countryStr},'${dropTargetId}')"></i>
        </div>
    </div>`;
    return column;
}
function changeIcon(icon, country, dropTargetId) {
    let class_name = icon.className.split(" ");
    icon.classList.toggle("fa-solid");
    if (class_name.length == 2) {
        addToFavourate(country, () => { displayFavourateList(dropTargetId); });
    }
    else {
        removeCountryFromList(country, () => { displayFavourateList(dropTargetId); });
    }
}
function createFavouriteItem(favouriteCountry) {
    let favourateItem = document.createElement('span');
    favourateItem.setAttribute('class', 'd-flex justify-content-between my-2');
    favourateItem.setAttribute('id', `favorate-span-${favouriteCountry.cca2}`);
    favourateItem.innerHTML = `
    <span>
        <img class="favorite-card-img rounded" src= ${favouriteCountry.flags.svg}>
        <h5 class="mx-2 d-inline fw-bold">${favouriteCountry.name.common}</h5>
    </span>
    <i class="fa-solid fa-circle-xmark" id="close" onclick="removeFromFavouritesBar('${favouriteCountry.cca2}','favorate-span-${favouriteCountry.cca2}' )"></i>`;
    return favourateItem;
}
function fillStar() {
    let favorites = getFromLocalStorage('favouratesList')
    if (favorites) {
        for (let favourateCountry of favorites) {
            let icon = document.getElementById(`${favourateCountry.cca2}-starIcon`);
            if (icon) {
                icon.setAttribute('class', "fa-regular fa-star fa-solid");
            }
        }
    }
}