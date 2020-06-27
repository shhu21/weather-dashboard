// Global Variables
var apiURL = "https://api.openweathermap.org/data/2.5/";
var apiKey = "?appid=640b3bbebec045da381544940d161ab8";

// API call
function callAPI(url, callBack) {
    fetch(url).then(function(response) {
        if(response.ok) {
            response.json().then(function (response) {
                callBack(response);
            });
        }
        else {
            window.alert("Invalid city name.");
            $('#city').val("");
        }
    })
}

// create the URL string
function createURL(call, param, param2) {
    if(call == "uvi" || call == "onecall") {
        return `${apiURL}${call}${apiKey}&lat=${param}&lon=${param2}&units=imperial`;
    }
    else {
        return `${apiURL}${call}${apiKey}&q=${param}&units=imperial`;
    }
}

// create the html elements of the history list
function historyList(city) {
    // creates the whole list if the parameter isn't passed
    if(!city) {
        for(var i = 0; i < localStorage.length; i++) {
            var list = $('.list-group');
            var item = $('<button>')
                .addClass("list-group-item list-group-item-action")
                .attr('id', localStorage.getItem(localStorage.key(i)));
            item.text(localStorage.key(i));
            list.prepend(item);
        }
    }
    else {
        // adds the newly searched city to the history list
        var list = $('.list-group');
        var item = $('<button>')
            .addClass("list-group-item list-group-item-action")
            .attr('id', localStorage.getItem(city));
        item.text(city);
        list.prepend(item);
    }
    $('.list-group-item').on('click', function (event) {
        // prevent multiple calls
        event.stopImmediatePropagation();
        var url = createURL("weather", this.textContent);
        callAPI(url, currentWeather);
    });
}

// save the searched city into local storage
function saveHistory(city) {
    if(!localStorage.getItem(city)) {
        var id = city.replace(" ", "");
        localStorage.setItem(city, id);
    }
    else {
        $(`#${localStorage.getItem(city)}`)[0].remove();
    }
    historyList(city);
}

// creates each line of weather data
function createInfo(infoData) {
    var cityInfo = $('.card-subtitle');
    var info = $('<p>').text(infoData);
    cityInfo.append(info);
}

// creates the uv index 
function uvIndex(data) {
    var cityInfo = $('.card-subtitle');
    var uv = data.value;
    var scale = "";
    // set the color
    if(uv <= 2) {
        scale = "bg-sucess";
    }
    else if(uv <= 7) {
        scale = "bg-warning";
    }
    else {
        scale = "bg-danger";
    }
    var info = $('<p>').text('UV Index: ');
    var index = $('<span>')
        .text(`${uv}`)
        .attr('id', 'uv-index')
        .addClass(scale);
    info.append(index);
    cityInfo.append(info);
}

// create current weather card
function currentWeather(data) {
    // create the current weather html elements
    var cityTitle = $('#current-city');
    var img = $('<img>');
    img[0].src = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    var icon = $('<span>').append(img);
    cityTitle.text(`${data.name} ${moment().format('M/DD/YYYY')}`);
    cityTitle.append(icon);

    // do a check if the current title is the same as the searched city then do nothing
    var currentDiv = $('#current-weather')
    currentDiv.addClass("card").attr('style', 'width: 100%');
    $('.card-subtitle')[0].innerHTML = "";
    createInfo(`Temperature: ${data.main.temp}°F`);
    createInfo(`Humidity: ${data.main.humidity}%`);
    createInfo(`Wind Speed: ${data.wind.speed} MPH`);

    // call the APIs
    var url = createURL("uvi", data.coord.lat, data.coord.lon);
    callAPI(url, uvIndex);
    // url = createURL("forecast", data.name);
    url = createURL("onecall", data.coord.lat, data.coord.lon);
    callAPI(url, forecast);
    saveHistory(data.name);
}

// create the 5-day forecast html elements
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

        var date = data.daily[i].dt;
        date = moment.unix(date).format('M/DD/YYYY');

        var title = $('<h5>')
            .addClass('card-title')
            .text(date);
        var img = $('<img>');
        img[0].src = `http://openweathermap.org/img/w/${data.daily[i].weather[0].icon}.png`;
        var temp = $('<p>').text(`Temp: ${data.daily[i].temp.day}°F`);
        var humidity = $('<p>').text(`Humidity: ${data.daily[i].humidity}%`);
        card.append(body, title, img, temp, humidity);
        forecastDiv.append(card);

    }
}

// get the searched city and call the API
var searchCity = function () {
    var city = $('#city').val();
    $('#city').val("");
    // create the API URL
    var url = createURL("weather", city);
    callAPI(url, currentWeather);
}

// if there's previously stored search history, create the history list
if(localStorage.length !== 0) {
    historyList();
}

$('.oi').on('click', function (event) {
    searchCity();
});