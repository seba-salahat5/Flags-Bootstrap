let countries = [];
let selectedRegion = 'No Filter';
function initial(rowId, searchFieldId) {
    let APIUrl = 'https://restcountries.com/v3.1';
    fetchCountries(`${APIUrl}/all`).then( responseData => {
        if(!responseData) {
            return;
        }

        for(let country of responseData) {
            countries.push(country);
        }
        displayCountries (rowId,countries);
        console.log(countries.length);
    }).catch( e=> {
        console.log(e);
    });

    searchEvent(APIUrl,searchFieldId, rowId);
}

async function fetchCountries(url) {
    try {
        let response = await fetch(`${url}`);

        if(!response.ok) {
            throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        return await response.json();
    }catch (e) {
        console.log(e);
    }
}

function displayCountries(rowId, fetchedCountries){
    let currentRow = document.getElementById(rowId);
    let parentElement = currentRow.parentNode;

    let newRow = createRow(rowId);
    if(fetchedCountries.length == 0) {
        let msg = createH5('No results Found');
        newRow.appendChild(msg);
        parentElement.removeChild(currentRow);
        parentElement.appendChild(newRow);
        applyMode(localStorage.getItem('darkMode'));
        return;
    }

    if(!fetchedCountries) {
        return;
    }

    for(let country of fetchedCountries) {
        newRow.appendChild(createColumn(country));
    }
    parentElement.removeChild(currentRow);
    parentElement.appendChild(newRow);
    applyMode(localStorage.getItem('darkMode'));
}

function selectFilter (listId ,cb) {
    let items = document.querySelectorAll(listId);
    let tab =[];

    for(let i=0; i< items.length; i++) {
        tab.push(items[i].innerHTML);
    }

    for(let i=0; i<items.length; i++){
        items[i].onclick = function (){
        index = tab.indexOf(this.innerHTML);
        selectedRegion = this.innerHTML;
        console.log(this.innerHTML + " index: "+ index);
        };
    }
    cb();

}

function filterCountries(region, allCountries){
    let filteredCountries = [];
    for(let country of allCountries) {
        if((country.region === region) || (region === 'No Filter') ){
            filteredCountries.push(country);
        }
    }

    return filteredCountries;
}

function searchEvent (APIUrl,searchFieldId, rowId){
    let inputStr ='';
    let searchTextField = document.getElementById(`${searchFieldId}`);
    searchTextField.addEventListener('keyup', async (e) => {
        if (`${e.key}` === 'Backspace'){
            inputStr = inputStr.slice(0, inputStr.length -1);  
        }
        else if(`${e.key}`.length === 1){
            inputStr = inputStr + `${e.key}`;
        }
        console.log(inputStr);
        loadCountries(APIUrl,inputStr, rowId);
    });
}

function loadCountries(APIUrl,searchValue, rowId){
    console.log("loading");
    let searchResult = [];
    let url = '';
    searchValue == ''? url = `${APIUrl}/all` : url= `${APIUrl}/name/${searchValue}`
    fetchCountries(url).then(response => {
        if(!response) {
            return;
        }

        for(let country of response) {
            if(country.region == selectedRegion || selectedRegion == 'No Filter'){
                searchResult.push(country);
            }
        }
        console.log(searchResult.length);
        //filterCountries(selectedRegion,searchResult);
        displayCountries(rowId, searchResult);
        return searchResult;
    }).catch( e=> {
        console.log(e);
    });
}



function DisplayDetails(countryCode) {
    let parameter = new URLSearchParams();
    parameter.append("countryCode", `${countryCode}`);
    console.log(countryCode);
    location.href = "file:///C:/Users/hp/Desktop/Flags-Bootstrap/details.html?" + parameter.toString();
}

// dark mode
function switchMode() {
    let darkMode = localStorage.getItem('darkMode');
    console.log("before: "+darkMode);

    darkMode == 'true' ? darkMode = 'false' : darkMode='true';
    localStorage.setItem('darkMode', darkMode);
    applyMode(darkMode);


}

function applyMode(darkMode){
    
    let body = document.body;
    let elements = document.querySelectorAll(".white"); 

    let bgColor = "white";
    let fontColor = "#111517";

    document.getElementById("btn").innerHTML = "Dark Mode";
    body.style.backgroundColor = "#fafafa";
    body.style.color = "#111517";

    if(darkMode == 'true'){
        document.getElementById("btn").innerHTML = "Light Mode";
        body.style.backgroundColor = "#202c37";
        body.style.color = "white";

        bgColor = "#2b3945";
        fontColor = "white";
    }

    for (let i = 0; i < elements.length; i++) {
        elements[i].style.backgroundColor= bgColor;
        elements[i].style.color = fontColor;
    }
        
}

// view 
function createRow(rowId) {
    let row = document.createElement('div');
    row.setAttribute('class', 'row row-cols-lg-4 row-cols-md-3  row-cols-sm-2 row-cols-1 g-5');
    row.setAttribute('id', `${rowId}`);
    return row;
}

function createColumn (country) {
    let column = document.createElement('div');
    column.setAttribute ('class', 'col');

    let card = createCard(country);
    column.appendChild(card);
    return column;
}

function createCard (country) {
    let card = document.createElement('div');
    card.setAttribute('class', 'card h-100 white');
    //card.setAttribute('onclick', DisplayDetails(country.cca2));
    card.onclick = function() {
        DisplayDetails(country.cca2);
    };

    let img = createImg(country.flags.svg, country.name.common);
    card.appendChild(img);

    let cardBody = document.createElement('div');
    cardBody.setAttribute ('class', 'card-body');
    cardBody.setAttribute ('id', `${country.name.common}`);

    let name = createH5(`${country.name.common}`);
    let population = createH6('Population: ', `${country.population}`);
    let region = createH6('Region: ', `${country.region}`);
    let capital = createH6('Capital: ', `${country.capital}`);

    cardBody.appendChild(name);
    cardBody.appendChild(population);
    cardBody.appendChild(region);
    cardBody.appendChild(capital);
    
    card.appendChild(cardBody);
    return card;
}

function createImg (src, alt) {
    let img = document.createElement('img');
    img.setAttribute('class', 'card-img-top');
    img.setAttribute('src', `${src}`);
    img.setAttribute('alt', `${alt}`);

    return img;
}

function createH5 (str) {
    let h5 = document.createElement('h5');
    h5.setAttribute ('class', 'card-title text-start fw-bold');
    h5.setAttribute ('id', `country-${str}-name`);
    h5.innerText = str;
    return h5;
}

function createSpan (str, title){
    let span = document.createElement('span');
    if(title){
        span.setAttribute('class', 'fw-bold');
    }
    span.innerText = str;
    return span;
}
function createH6 (title, value) {
    let titleSpan = createSpan (`${title}`, true);
    let valueSpan = createSpan (`${value}`, false);

    let h6 = document.createElement('h6');
    h6.setAttribute('class', 'text-start');

    h6.appendChild(titleSpan);
    h6.appendChild(valueSpan);
    return h6;
}
