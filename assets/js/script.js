var apiURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "?appid=640b3bbebec045da381544940d161ab8"

function callAPI(url, callBack) {
    fetch(url).then(function(response) {
        if(response.ok) {
            response.json().then(function (response) {
                callBack(response);
            });
        }
    })
}

function createURL(call, param, param2) {
    if(param2) {
        return `${apiURL}${call}${apiKey}&lat=${param}&lon=${param2}`;
    }
    else {
        return `${apiURL}${call}${apiKey}&q=${param}`;
    }
}

function historyList() {
    // create the html elements of the history list
}

function saveHistory() {
    // save last 5 searched cities in local storage
    // historyList();
}

function currentWeather(data) {
    console.log(data);
    // create current weather card
}

function forecast(data) {
    // create forecast divs
    // saveHistory(data.name, div of the whole column)
}

var searchCity = function () {
    var city = $('#city').val();
    var url = createURL("weather", city);
    callAPI(url, currentWeather);
}

$('.oi').on('click', searchCity);