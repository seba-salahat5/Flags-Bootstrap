let apiUrl = 'https://restcountries.com/v3.1/name/';
let fields = ['name', 'native', 'population', 'region', 'subRegion' , 'capital' , 'tld', 'currencies', 'languages','flags']

async function fetchDetails(name) {
    try {
        let response = await fetch(`${apiUrl}${name}/?fields=name,population,region,subregion,capital,tld,currencies,languages,flags`);

        if(!response.ok) {
            throw new Error(`Failed to fetch the country details: ${response.status}`);
        }
        return await response.json();
    }catch (e) {
        console.log(e);
    }

} 

function displayDetails (elementId, flagDiv) {
    let ImageDiv =  document.getElementById(`${flagDiv}`);

    let detailsColumn = document.getElementById(`${elementId}`);
    fetchDetails(window.countryName).then( details => {
        if(!details) {
            detailsColumn.innerText = 'No results Found';
            return;
        }

        let flag = createImg(details[0].flags.svg, details[0].name.common);
        ImageDiv.appendChild(flag);

        let inner_text = [
            `${details[0].name.common}`,
            `${details[0].name.nativeName.nld.common}`,
            `${details[0].population}`,
            `${details[0].region}`,
            `${details[0].subregion}`,
            `${details[0].capital}`,
            `${details[0].tld}`,
            `${details[0].currencies.EUR.name}`,
            `${Object.values(details[0].languages).join(', ')}`,
        ]
        for( let i=0; i< fields.length; i++)
        {
            document.getElementById(`${elementId}-${fields[i]}`).innerText = inner_text[i];
        }
        
    }).catch( e =>  {console.log(e);});
}

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

function createImg (src,alt) {
    let img = document.createElement('img');
    img.setAttribute('class', 'img-fluid');
    img.setAttribute('src', `${src}`);
    img.setAttribute('alt', `${alt}`);

    return img;
}