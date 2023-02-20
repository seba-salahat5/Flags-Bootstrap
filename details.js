let apiUrl = 'https://restcountries.com/v3.1/name/Belgium';
let fields = ['name', 'native', 'population', 'region', 'subRegion' , 'capital' , 'tld', 'currencies', 'languages']

async function fetchDetails() {
    try {
        let response = await fetch(`${apiUrl}/?fields=name,population,region,subregion,capital,tld,currencies,languages`);

        if(!response.ok) {
            throw new Error(`Failed to fetch the country details: ${response.status}`);
        }
        return await response.json();
    }catch (e) {
        console.log(e);
    }

} 

function displayDetails (elementId) {
    let detailsColumn = document.getElementById(`${elementId}`);
    fetchDetails().then( details => {
        if(!details) {
            detailsColumn.innerText = 'No results Found';
            return;
        }

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

/*function switchMode() {
    let mode = true;
    let element = document.body;
    element.classList.toggle("dark");

    let elements = document.getElementsByClassName('white');

    if(mode){

        for (let i = 0; i < elements.length; i++) {
            console.log(elements[i].innerHTML);
            elements[i].style.backgroundColor= "#2b3945";
            elements[i].style.color = "white";
        }
        mode = !mode;
    }
}*/
