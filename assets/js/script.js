var apiURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "?appid=640b3bbebec045da381544940d161ab8";

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
        return `${apiURL}${call}${apiKey}&q=${param}&units=imperial`;
    }
}

var loadCity = function (city) {
    // if(!city) {
        // var city = this.previousElementSibling.textContent;
    // }
    // $('#weather').innerHTML = localStorage.getItem(city);
}

function historyList() {
    // create the html elements of the history list
    var list = $('.list-group');
    for(var i = 0; i < localStorage.length; i++) {
        var item = $('<button>')
            .addClass("list-group-item list-group-item-action")
            .text(localStorage.key(i));
        item.on('click', loadCity(item.textContent));
        list.append(item);
    }
}

function saveHistory(city, info) {
    console.log(city);
    // save last 5 searched cities in local storage
    if(localStorage.length == 5) {
        localStorage.pop();
    }
    localStorage.setItem(city, info);
    historyList();
}

function createInfo(infoData) {
    var cityInfo = $('.card-subtitle');
    var info = $('<p>').text(infoData);
    cityInfo.append(info);
}

var uvIndex = function(data) {
    var cityInfo = $('.card-subtitle');
    var uv = data.current.uvi;
    var scale = "";
    if(uv <= 2) {
        scale = "green";
    }
    else if(uv <= 7) {
        scale = "yellow";
    }
    else {
        scale = "red";
    }
    var info = $('<p>').text('UV Index: ');
    var index = $('<span>')
        .text(`${uv}`)
        .attr('id', 'uv-index')
        .attr('style', `background-color: ${scale}`);
    info.append(index);
    cityInfo.append(info);
}

// create current weather card
function currentWeather(data) {
    console.log(data);
    if(localStorage.getItem(data.name)) {
        loadCity(data.name);
        return;
    }
    
    var cityTitle = $('#current-city');
    var img = $('<img>');
    img[0].src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    var icon = $('<span>').append(img);
    cityTitle.text(`${data.name} ${moment().subtract(10, 'days').calendar()}`);
    cityTitle.append(icon);

    // do a check if the current title is the same as the searched city then do nothing
    var currentDiv = $('#current-weather')
    currentDiv.addClass("card").attr('style', 'width: 100%');
    createInfo(`Temperature: ${data.main.temp}°F`);
    createInfo(`Humidity: ${data.main.humidity}%`);
    createInfo(`Wind Speed: ${data.wind.speed} MPH`);
    var url = createURL("onecall", data.coord.lat, data.coord.lon);
    callAPI(url, uvIndex);
    saveHistory(data.name, $('#weather')[0].innerHTML);
}

function forecast(data) {
    // create forecast divs
    // saveHistory(data.name, $('#weather')[0].innerHTML)
}


var searchCity = function () {
    var city = $('#city').val();
    var url = createURL("weather", city);
    callAPI(url, currentWeather);
    url = createURL("forecast", city);
    callAPI(url, forecast);
}

if(localStorage) {
    // get the first city and display it using loadCity(key)
}

$('.oi').on('click', searchCity);