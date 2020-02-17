let city;
let date = moment().format("MM") + "/" + moment().format("D") + "/" + moment().format("YYYY");
let temp;
let humidity;
let windSpeed;
let uvIndex;
let currentQueryURL;
let longitude;
let latitude;
let currentPosition = navigator.geolocation.getCurrentPosition(getCurrentCity);

function getCurrentCity(pos) {
    longitude = pos.coords.longitude;
    latitude = pos.coords.latitude;
    $.ajax({
        url: "https://us1.locationiq.com/v1/reverse.php?key=a1afd1ebbc7af7&lat=" + latitude + "&lon=" + longitude + "&format=json",
        type: "GET"
    }).then(function (response) {
        city = response.address.city;
        currentWeatherCall(city);
        forcastWeatherCall(city);
    })
}

function weatherDisplay(city, temp, humidity, windSpeed, uvIndex, icon) {
    $("#weather-display").empty();
    $("#weather-display").append(
        $("<h1>").text(city + "(" + date + ")").attr({class: "is-size-2", id: "displayDate"}).append(
            $("<span>").append(
                $("<img>").attr({src: icon})
            )
        ),
        $("<p>").text("Temperature: " + temp + "F"),
        $("<p>").text("Humidity: " + humidity + "%"),
        $("<p>").text("Wind Speed: " + windSpeed + "MPH"),
        $("<p>").text("UV Index: ").append(
            $("<span>").text(uvIndex).attr("class", "has-background-danger has-text-light wrapper rounded")
        )

    )

}

$("#searchButton").on("click", function (e) {
    let searchValue = $("#searchBox").val().trim();
    currentWeatherCall(searchValue);
    forcastWeatherCall(searchValue);
})

function currentWeatherCall(city) {
    currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6133582a13f76cf0a556408e3196e907&units=imperial";
    $.ajax({
        url: currentQueryURL,
        type: "GET"
    }).done(function (response) {
        city = response.name;
        temp = response.main.temp;
        humidity = response.main.humidity;
        windSpeed = response.wind.speed;
        latitude = response.coord.lat;
        longitude = response.coord.lon;
        let icon = "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
        console.log(icon);
        uvCall(latitude, longitude, city, temp, humidity, windSpeed, icon);
    })
}

function uvCall(latitude, longitude, city, temp, humidity, windSpeed, icon) {
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/uvi?appid=6133582a13f76cf0a556408e3196e907&lat=" + latitude + "&lon=" + longitude,
        type: "GET"
    }).done(function (response) {
        uvIndex = response.value;
        weatherDisplay(city, temp, humidity, windSpeed, uvIndex, icon)
    })
}

$("#menu").on("click", "button", function (e) {
    let searchValue = e.target.textContent;
    currentWeatherCall(searchValue);
    forcastWeatherCall(searchValue);
    $("#searchBox").val("");
})

function forcastWeatherCall(city) {
    currentQueryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=6133582a13f76cf0a556408e3196e907&units=imperial";
    $.ajax({
        url: currentQueryURL,
        type: "GET"
    }).done(function (response) {
        $("#forecastRow").empty();
        let iterator = 0;
        for (let i = 0; i < 40; i++) {
            let currentDate = response.list[i].dt_txt.toString().slice(0,10);
            let callDate = moment().format("YYYY") + "-" + moment().format("MM") + "-" + (parseInt(moment().format("D")) + iterator + 1);
            if (currentDate === callDate) {
                let icon = "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png"
                let temp = response.list[i].main.temp;
                let humidity = response.list[i].main.humidity;
                forecastDisplay(temp, humidity, icon, iterator);
                iterator++;
            }
        }
    })

}

function forecastDisplay(temp, humidity, icon, i) {
    $("#forecastRow").append(
        $("<div>").attr("class", "column is-one-fifth").append(
            $("<div>").attr("class", "notification is-link stretch").append(
                $("<h3>").text(moment().format("MM") + "/" + (parseInt(moment().format("D")) + i + 1) + "/" + moment().format("YYYY")).attr("class", "is-size-5 has-text-weight-semibold"),
                $("<img>").attr("src", icon),
                $("<div>").text("Temp: " + temp),
                $("<div>").text("Humidity: " + humidity + "%")
            )
        )
    )

}
