let favouratesList = JSON.parse(localStorage.getItem('favouratesList'));
let dragged = null;
var localStorageValue;
let notduplicated=false;
async function initial(rowId, searchFieldId, menuID) {
    let APIUrl = 'https://restcountries.com/v3.1';
    let countries = [];
    let selectedRegion = 'No Filter';
    let inputStr = '';

    searchEvent(searchFieldId, inputStr, async (inputStr) => {
        loadCountries(APIUrl, inputStr).then(res => {
            selectedRegion == 'Favourites'
            ? countries = favouratesList
            : countries = res.filter(country => country.region == selectedRegion || selectedRegion == 'No Filter');
            displayCountries(rowId, countries, () => {
                applyMode();
                fillStar(favouratesList);
            });
        });
    });

    selectFilter(menuID, selectedRegion, (filter) => {
        let filteredCountries = [];
        selectedRegion = filter;
        selectedRegion == 'Favourites'
        ? filteredCountries = favouratesList
        : filteredCountries= countries.filter(country => country.region == selectedRegion || selectedRegion == 'No Filter');
        displayCountries(rowId, filteredCountries, () => {
            applyMode();
            fillStar(favouratesList);
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
        displayCountries(rowId, countries, () => {
            applyMode();
            fillStar(favouratesList);
        });
        console.log(favouratesList);
        if(favouratesList){
            for(let favourateItem of favouratesList){
                document.getElementById("droptarget").appendChild(createFavouriteItem(favourateItem));
            }
        }
        
    } catch (e) {
        console.log(e);
    }

}


function displayCountries(rowId, fetchedCountries, cb) {
    let currentRow = document.getElementById(rowId);
    let parentElement = currentRow.parentNode;

    let newRow = createRow(rowId);
    if (fetchedCountries.length == 0) {
        let msg = createH5('No results Found');
        newRow.appendChild(msg);
        parentElement.removeChild(currentRow);
        parentElement.appendChild(newRow);
        return;
    }

    if (!fetchedCountries) {
        return;
    }

    for (let country of fetchedCountries) {
        newRow.appendChild(createColumn(country));
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
        setTimeout(() => {
            inputStr = e.target.value ?? '';
            cb(inputStr);
        }, 500);

    });
}

async function loadCountries(APIUrl, searchValue) {
    let url = '';
    searchValue == '' ? url = `${APIUrl}/all` : url = `${APIUrl}/name/${searchValue}`;
    /*const controller = new AbortController();
    const {signal} = controller;
    fetch(url, {signal})
    .then((response)=>response.json())
    .then((data)=>{return data });*/

    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        return await response.json();
    } catch (e) {
        console.log(e);
    }

}



function DisplayDetails(countryCode) {
    let parameter = new URLSearchParams();
    parameter.append("countryCode", `${countryCode}`);
    location.href = "file:///C:/Users/hp/Desktop/Flags-Bootstrap/details.html?" + parameter.toString();
    //location.href = "https://seba-salahat5.github.io/Flags-Bootstrap/details?" + parameter.toString();

}

function initializeTarget(){
    const target = document.getElementById("droptarget");
    console.log(target);
    target.addEventListener("dragover", (event) => {
        event.target.style.border= "2px solid transparent";
        event.target.style.borderColor ="#27ae60";
        event.preventDefault();
    });

    target.addEventListener("dragleave", (event) => {
        event.target.style.border= "2px solid transparent";
        event.preventDefault();
    });

    target.addEventListener("drop", (event) => {
        addToFavourate(dragged.country);
        if(notduplicated){
            event.preventDefault();
            if (event.target.id == "droptarget") {
                event.target.appendChild(createFavouriteItem(dragged.country));
                event.target.style.border= "2px solid transparent";
            }
        }
    });
}
function addToFavourate(country){
    if(!favouratesList){
        favouratesList=[];
    }
    if(!favouratesList.some((element) => element.cca2 == country.cca2)){
        favouratesList.push(country);
        setInLocalStorage('favouratesList',favouratesList);
        notduplicated = true;
    }
}
function removeFromFavouritesBar(countryToRemove, spanId){
    removeCountryFromList(countryToRemove);
    let favourteItem = document.getElementById(spanId);
    favourteItem.parentNode.removeChild(favourteItem);
}

function removeCountryFromList(countryToRemove){
    const index = favouratesList.findIndex((country) => country.cca2 == countryToRemove);
    favouratesList.splice(index, 1);
    setInLocalStorage('favouratesList',favouratesList);
}

//local storage
function setInLocalStorage(key, value){
    try{
        localStorage.setItem(key, JSON.stringify(value));
    }catch(err){
        localStorageValue = {key: key, value:value};
    }
}

function getFromLocalStorage(key){
    try{
        return JSON.parse(localStorage.getItem(key));
    }catch(err){
        return window.localStorageValue;
    }
}
// dark mode
function switchMode() {
    let darkMode = getFromLocalStorage('darkMode');
    darkMode = !darkMode;
    setInLocalStorage('darkMode', darkMode);
    applyMode();


}

function applyMode() {
    let darkModeStatus = getFromLocalStorage('darkMode');
    console.log(darkModeStatus);
    let body = document.body;
    let elements = document.querySelectorAll(".white");

    let bgColor = "white";
    let fontColor = "#111517";

    document.getElementById("btn").innerHTML = "Dark Mode";
    body.style.backgroundColor = "#fafafa";
    body.style.color = "#111517";

    if (darkModeStatus) {
        document.getElementById("btn").innerHTML = "Light Mode";
        body.style.backgroundColor = "#202c37";
        body.style.color = "white";

        bgColor = "#2b3945";
        fontColor = "white";
    }

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor = bgColor;
        elements[i].style.color = fontColor;
    }
}


// view 
function createRow(rowId) {
    let row = document.createElement('div');
    row.setAttribute('class', 'row row-cols-lg-3 row-cols-md-2  row-cols-sm-2 row-cols-1 g-5');
    row.setAttribute('id', `${rowId}`);
    return row;
}

function createColumn(country) {
    let countryStr = JSON.stringify(country);
    countryStr = countryStr.replaceAll('"', "'");
    //console.log(`'${countryStr}'`);
    let column = document.createElement('div');
    column.setAttribute('class', 'col');
    column.setAttribute('draggable', "true");
    column.setAttribute('id', "draggable");
    column.addEventListener("dragstart", (event) => {
        console.log("drag");
        dragged = {event: event.target, country:country};
        initializeTarget();
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
            <i class="fa-regular fa-star" id="${country.cca2}-starIcon" onclick= "changeIcon(this,${countryStr})"></i>
        </div>
    </div>`;
    return column;
}

function changeIcon(icon, country){
    let class_name = icon.className.split(" ");
    icon.classList.toggle("fa-solid");
    if(class_name.length == 2){
        addToFavourate(country);
    }
    else {
        removeCountryFromList(country);
    }
}

function createFavouriteItem(favouriteCountry){
    let favourateItem = document.createElement('span');
    favourateItem.setAttribute('class','d-flex justify-content-between my-2');
    favourateItem.setAttribute('id',`favorate-span-${favouriteCountry.cca2}`);
    favourateItem.innerHTML = `
    <span>
        <img class="favorite-card-img rounded" src= ${favouriteCountry.flags.svg}>
        <h5 class="mx-2 d-inline fw-bold">${favouriteCountry.name.common}</h5>
    </span>
    <i class="fa-solid fa-circle-xmark" id="close" onclick="removeFromFavouritesBar('${favouriteCountry.cca2}','favorate-span-${favouriteCountry.cca2}' )"></i>`;
    return favourateItem;
}
function fillStar(favorites){
    if(favorites){
        for(let favourateCountry of favorites){
            let icon = document.getElementById(`${favourateCountry.cca2}-starIcon`);
            if(icon){
                icon.setAttribute('class', "fa-regular fa-star fa-solid");      
            } 
        }
    }
    
}
