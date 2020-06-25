var apiURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "?appid=640b3bbebec045da381544940d161ab8";
var searchList = [];


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

var loadCity = function(city) {
    $('#weather')[0].innerHTML = localStorage.getItem(city);
}

function historyList(city) {
    // create the html elements of the history list
    if(!city) {
        for(var i = 0; i < localStorage.length; i++) {
            var list = $('.list-group');
            var item = $('<button>')
                .addClass("list-group-item list-group-item-action")
                .attr('id', localStorage.key(i));
            item.text(localStorage.key(i));
            list.prepend(item);
        }
    }
    else {
        var list = $('.list-group');
        var item = $('<button>')
            .addClass("list-group-item list-group-item-action")
            .attr('id', city);
        item.text(city);
        list.prepend(item);
    }
    $('.list-group-item').on('click', function () {
        loadCity(this.textContent);
    });
}

function saveHistory(city, info) {
    if(localStorage.length == 5) {
        var key = $(`.list-group-item`).children().prevObject.last()[0].textContent;
        localStorage.removeItem(key);
        $(`.list-group-item`).children().prevObject.last().remove()
    }
    localStorage.setItem(city, info);
    historyList(city);
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
    $('.card-subtitle')[0].innerHTML = "";
    createInfo(`Temperature: ${data.main.temp}°F`);
    createInfo(`Humidity: ${data.main.humidity}%`);
    createInfo(`Wind Speed: ${data.wind.speed} MPH`);
    var url = createURL("onecall", data.coord.lat, data.coord.lon);
    callAPI(url, uvIndex);
    url = createURL("forecast", data.name);
    callAPI(url, forecast);
}

function forecast(data) {
    var forecastDiv = $('#forecast-div');
    forecastDiv[0].innerHTML = "";
    var forecastTitle = $('<h4>')
        .addClass("col-12")
        .text("5-Day Forecast");
    forecastDiv.append(forecastTitle);
    // create forecast divs
    for(var i = 1; i < 6; i++) {
        var card = $('<div>')
            .addClass('card')
            .attr('id', 'forecast');
        var body = $('<div>').addClass('card-body');

        var date = data.list[i].dt_txt;
        date = date.split(" ")[0];
        date = moment(date, 'YYYY-MM-DD').format('M/DD/YYYY');

        var title = $('<h5>')
            .addClass('card-title')
            .text(date);
        var img = $('<img>');
        img[0].src = `http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png`;
        var temp = $('<p>').text(`Temp: ${data.list[i].main.temp}°F`);
        var humidity = $('<p>').text(`Humidity: ${data.list[i].main.humidity}%`);
        card.append(body, title, img, temp, humidity);
        forecastDiv.append(card);

    }
    saveHistory(data.city.name, $('#weather')[0].innerHTML);
}


var searchCity = function () {
    var city = $('#city').val();
    var url = createURL("weather", city);
    callAPI(url, currentWeather);
}

if(localStorage.length !== 0) {
    historyList();
}

$('.oi').on('click', searchCity);