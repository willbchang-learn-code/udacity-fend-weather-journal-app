// OpenWeatherMap API
const API_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const API_KEY = '&appid=11b940524d71f36872344aae4118274d&units=imperial';

onClick('generate', performAction)

function onClick(elementID, performAction) {
    document.getElementById(elementID).addEventListener('click', performAction)
}

async function performAction() {
    const zip = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    if (hasEmptyInput()) return alert('Please fill the info.');
    if (!isZipCode()) return alert('Please enter a valid zip code');

    await postData('/clientData', createClientData(
        await getData(API_URL + zip + API_KEY)
    ));
    updateUI(await getData('/serverData'));

    function hasEmptyInput() {
        return zip === '' || feelings === '';
    }

    // https://stackoverflow.com/a/5586636/9984029
    function isZipCode() {
        return /^\d{5}(-\d{4})?(?!-)$/.test(zip)
    }

    function createClientData(weather) {
        return {
            temp: weather.main.temp,
            date: currentDate(),
            content: feelings
        };
    }

    function currentDate() {
        const date = new Date();
        return date.getMonth() + 1 + '.' + date.getDate() + '.' + date.getFullYear();
    }

    function updateUI(serverData) {
        document.getElementById('temp').innerText = serverData.temp + '℉';
        document.getElementById('date').innerText = serverData.date;
        document.getElementById('content').innerText = serverData.content;
        document.getElementById('zip').value = '';
        document.getElementById('feelings').value = '';
    }
}

async function getData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (e) {
        console.error(e);
    }
}

async function postData(url = '', data = {}) {
    const option = {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    try {
        const response = await fetch(url, option);
        return await response.json();
    } catch (e) {
        console.log(e);
    }
}
