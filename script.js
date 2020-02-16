let city;
let date = moment().format("MM") + "/" + moment().format("D") + "/" + moment().format("YYYY");
let temp;
let humidity;
let windSpeed;
let uvIndex;
let currentQueryURL;
let currentPosition = navigator.geolocation.getCurrentPosition(getCity);

function getCity(pos) {

    let longitude = pos.coords.longitude;
    let latitude = pos.coords.latitude;
    $.ajax({
        url: "https://us1.locationiq.com/v1/reverse.php?key=a1afd1ebbc7af7&lat=" + latitude + "&lon=" + longitude + "&format=json",
        type: "GET"
    }).then(function (response) {
        city = response.address.city;
        currentWeatherCall(city, latitude, longitude);
    })
}

function weatherDisplay(city, temp, humidity, windSpeed, uvIndex) {
    $("#weather-display").empty();
    $("#weather-display").append(
        $("<h1>").text(city + "(" + date + ")").attr("class", "is-size-2"),
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
})

function currentWeatherCall(city, latitude, longitude) {
    uvIndex = uvCall(latitude, longitude);
    currentQueryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=6133582a13f76cf0a556408e3196e907&units=imperial";
    $.ajax({
        url: currentQueryURL,
        type: "GET"
    }).then(function (response) {
        city = response.name;
        temp = response.main.temp;
        humidity = response.main.humidity;
        windSpeed = response.wind.speed;

        weatherDisplay(city, temp, humidity, windSpeed, uvIndex);
    })
}

function uvCall(latitude, longitude){
    $.ajax({
        url: "http://api.openweathermap.org/data/2.5/uvi?appid=6133582a13f76cf0a556408e3196e907&lat=" + latitude + "&lon=" + longitude,
        type: "GET"
    }).then(function(response){
        uvIndex = response.value;
    })
}