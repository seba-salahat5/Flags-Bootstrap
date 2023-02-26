


/*let APIUrl = 'https://restcountries.com/v3.1';
let selectedRegion = 'No Filter';
let searchResult = [];
let found = false;
let elements = document.getElementsByClassName('white');

let darkMode = localStorage.getItem('darkMode');

async function fetchCountries(url) {
    try {
        let response  = await fetch(`${url}`);

        if(!response.ok) {
            throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        return await response.json();
    }catch (e) {
        console.log(e);
    }
}

function filterByRegion(listId, rowId, searchFieldId){
    
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
        
        let currentRow = document.getElementById(`${rowId}`);
        let parentElement = currentRow.parentNode;

        parentElement.replaceChild(createRow(rowId, selectedRegion, searchFieldId), currentRow);

        };
    }
    
}
function searchCountry(fetchedContries,searchFieldId, region){
    let inputStr ='';
    let searchTextField = document.getElementById(`${searchFieldId}`);

    searchTextField.addEventListener('keyup', (e) => {
        searchResult.splice(0,searchResult.length);
        if (`${e.key}` === 'Backspace'){
            inputStr = inputStr.slice(0, inputStr.length -1);            
        }
        else if(`${e.key}`.length === 1){
            inputStr = inputStr + `${e.key}`;
            for(countryName of Object.values(fetchedContries)){
                countryName = countryName.name.common;
                if(countryName.toLowerCase().startsWith(inputStr.toLowerCase()) && ((countryName.region === region) || (region === 'No Filter')) ){
                    console.log(countryName);
                    searchResult.push(countryName);
                    console.log(searchResult.length);
                }
            }
        }
    });
}
function createRow(rowId, region, searchFieldId) {
    console.log(region);
    let row = document.createElement('div');
    row.setAttribute('class', 'row row-cols-lg-4 row-cols-md-3  row-cols-sm-2 row-cols-1 g-5');
    row.setAttribute('id', `${rowId}`);

    fetchCountries(`${APIUrl}/all`).then( countries => {
        if(!countries) {
            card.innerText = 'No results Found';
            return;
        }
        //search filtering
        searchCountry(countries,searchFieldId, region);
        //region filtering
        if(searchResult.length === 0){
            console.log(searchResult.length);
            for(let country of countries) {
                if((country.region === region) || (region === 'No Filter') ){
                    row.appendChild(createColumn(country));
                    found = true;
                }
            }
            if(!found){
                row.appendChild(createH5("No results Found"));
            }
        }

        else if(searchResult.length >0){
            console.log(searchResult.length);
            for(let i=0; i<searchResult.length; i++){
                for(let country of countries) {
                    if(searchResult[i] === country.name.common && ( (country.region === region) || (region === 'No Filter') )){
                        row.appendChild(createColumn(country));
                        found = true;
                    }
                }
            }
            if(!found){
                row.appendChild(createH5("No results Found"));
            }
        }
        


    }).catch( e=> {
        console.log(e);
    });
    return row;
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

function createImg (src, alt) {
    let img = document.createElement('img');
    img.setAttribute('class', 'card-img-top');
    img.setAttribute('src', `${src}`);
    img.setAttribute('alt', `${alt}`);

    return img;
}

function createCard (country) {
    let card = document.createElement('div');
    card.setAttribute('class', 'card h-100 white');
    //card.setAttribute('onclick', DisplayDetails(country.cca2));
    card.onclick = function() {
        DisplayDetails(country.cca2);
    };
    applyMode();

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

function createColumn (country) {
    let column = document.createElement('div');
    column.setAttribute ('class', 'col');

    let card = createCard(country);
    column.appendChild(card);

    elements = document.getElementsByClassName('white');
    return column;
}

function DisplayDetails(countryCode) {
    let parameter = new URLSearchParams();
    parameter.append("countryCode", `${countryCode}`);
    console.log(countryCode);
    location.href = "file:///C:/Users/hp/Desktop/Flags-Bootstrap/details.html?" + parameter.toString();
}

function switchMode() {
    console.log(darkMode);
    darkMode = !darkMode;
    localStorage.setItem('darkMode', darkMode);
    let body = document.body;
    body.classList.toggle('darkmode');

    if(!darkMode){
        document.getElementById("btn").innerHTML = "Light Mode";
    }
    if(darkMode){
        document.getElementById("btn").innerHTML = "Dark Mode";
    }
    applyMode();


}

function applyMode(){
    cards = document.getElementsByClassName('card');
    if(darkMode === true){
        //console.log("helloo");
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.backgroundColor= "white";
            elements[i].style.color = "black";
        }
    }
    else if(darkMode === false){
        //console.log("hii");
        for (let i = 0; i < elements.length; i++) {
            //console.log(elements[i]);
            elements[i].style.backgroundColor= "#2b3945";
            elements[i].style.color = "white";
        }
        
    }
}*/