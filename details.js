let apiUrl = 'https://restcountries.com/v3.1/alpha/';
let fields = ['name', 'native', 'population', 'region', 'subRegion' , 'capital' , 'tld', 'currencies', 'languages']

async function fetchDetails(code) {
    try {
        console.log(code);
        let response = await fetch(`${apiUrl}${code}`);
        if(!response.ok) {
            throw new Error(`Failed to fetch the country details: ${response.status}`);
        }
        return await response.json();

    }catch (e) {
        console.log(e); 
    }

} 

function displayDetails (elementId, flagDiv, countryCode, fetchDetails) {
    let ImageDiv =  document.getElementById(`${flagDiv}`);

    let detailsColumn = document.getElementById(`${elementId}`);
    fetchDetails(countryCode).then( details => {
        if(!details) {
            detailsColumn.innerText = 'No results Found';
            return;
        }

        let flag = create_Img(details[0].flags.svg, details[0].name.common);
        ImageDiv.appendChild(flag);
        
        let inner_text = [
            `${details[0].name.common}`,
            `${Object.entries(details[0].name.nativeName)[0][1].common}`,
            `${details[0].population}`,
            `${details[0].region}`,
            `${details[0].subregion}`,
            `${details[0].capital}`,
            `${details[0].tld}`,
            `${Object.entries(details[0].currencies)[0][1].name}`,
            `${Object.values(details[0].languages).join(', ')}`,
        ]

        for( let i=0; i< fields.length; i++)
        {
            //console.log(document.getElementById(`${fields[i]}`));
            document.getElementById(`${fields[i]}`).innerText = inner_text[i];
        }
        applyMode(localStorage.getItem('darkMode'));
        
    }).catch( e =>  {console.log(e);});
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