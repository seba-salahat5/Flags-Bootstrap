async function init (elementId, flagDiv, countryCode, borderCountriesDivId) {
    let apiUrl = 'https://restcountries.com/v3.1/alpha/';
    let fields = ['flag','borders','name', 'native', 'population', 'region', 'subRegion' , 'capital' , 'tld', 'currencies', 'languages'];
    let data = [];
    let info ;

    try {
        let response = await fetch(`${apiUrl}${countryCode}`);

        if(!response.ok) {
            throw new Error(`Failed to fetch countries: ${response.status}`);
        }
        info = await response.json();
        data = [
            info[0].flags.svg,
            info[0].borders,
            info[0].name.common,
            Object.entries(info[0].name.nativeName)[0][1].common,
            info[0].population,
            info[0].region,
            info[0].subregion,
            info[0].capital,
            info[0].tld,
            Object.entries(info[0].currencies)[0][1].name,
            Object.values(info[0].languages).join(', '),
        ];
        displayDetails (elementId, flagDiv,fields, data );
        if(data[1]){
            console.log(data[1]);
            loadBorderCountries (apiUrl, data[1], async(borderCountry)=> {
                displayBorderCountries(borderCountry, borderCountriesDivId, ()=> {applyMode(localStorage.getItem('darkMode'))});
            });
        }    
        applyMode(localStorage.getItem('darkMode'));
    }catch (e) {
        console.log(e);
    }
}

async function loadBorderCountries (api, borderCodes, cb){
    for(let borderIndex=0; borderIndex < borderCodes.length; borderIndex++){
        try {
            let response = await fetch(`${api}${borderCodes[borderIndex]}`);
            if(!response.ok) {
                throw new Error(`Failed to fetch countries: ${response.status}`);
            }
            let country = await response.json();
            cb(country[0].name.common);
        }catch (e) {
            console.log(e);
        }
    }
    
}

function displayDetails (elementId, flagDiv,fields, data) {
    let ImageDiv =  document.getElementById(`${flagDiv}`);
    let flag = create_Img(data[0], data[1]);
    ImageDiv.appendChild(flag);

    for( let i=2; i< fields.length; i++)
    {
        document.getElementById(`${fields[i]}`).innerText = data[i];
    }
}

function displayBorderCountries(borderCountry, divId, cb) {
    let bordersDiv = document.getElementById(divId);
    bordersDiv.appendChild(createButton(borderCountry));
    cb();
}


//view 
function createH2 (str) {
    let element = document.createElement('h2');
    element.setAttribute ('class', 'fw-bold');
    element.innerText = str;
    return element;
}

function createH3 (str) {
    let element = document.createElement('h3');
    element.setAttribute ('class', 'card-text fs-6 fw-normal d-inline py-3');
    element.innerText = str;
    return element;
}

function create_Img (src,alt) {
    let img = document.createElement('img');
    img.setAttribute('class', 'img-fluid');
    img.setAttribute('src', `${src}`);
    img.setAttribute('alt', `${alt}`);

    return img;
}

function createButton(text) {
    let button = document.createElement('button');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn shadow-sm d-inline white mx-2 px-1 my-2 py-1');
    button.style.fontSize = "0.7rem";
    button.style.width = "7vw";
    button.style.height = "5vh";
    button.innerText = text;

    return button;
}