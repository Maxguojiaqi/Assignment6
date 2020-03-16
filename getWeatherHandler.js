document.getElementById('getWeatherBtn').addEventListener('click', function(){
    let cityName = document.getElementById('cityNameInput').value;
    let UrlForcastWeather = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=88d022e97f75868e6967c259abf2708a`
    let UrlCurrentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=88d022e97f75868e6967c259abf2708a`

    findForcastWeather(UrlForcastWeather)
    findCurrentWeather(UrlCurrentWeather)

});

function findForcastWeather(UrlForcastWeather){
    fetch(UrlForcastWeather)
    .then(res => res.json())
    .then(data => {
        console.log("forcast weather")
      console.log(data)
    })
    .catch(err => console.error(err));
}

function findCurrentWeather(UrlCurrentWeather){
    fetch(UrlCurrentWeather)
    .then(res => res.json())
    .then(data => {
        console.log("current weather")  
        console.log(data)
        let iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
        console.log(iconURL)
        document.getElementById('weatherCondition').setAttribute('src',iconURL)
        console.log("http://openweathermap.org/img/wn/${data.weather[0].icon}.png");
        document.getElementById('cityName').innerText = data.name;
        document.getElementById('temperature').innerText = "Temperature: " + String((data.main.temp - 273.15).toFixed(1));
        document.getElementById('humidity').innerText = "Humidity: " + String(data.main.humidity) + "%"
        document.getElementById('windSpeed').innerText = "Wind Speed: "+String(data.wind.speed) + " MPH"

        return data.coord
    }).then(coords =>{
        let UrlForcastUV = `http://api.openweathermap.org/data/2.5/uvi?APPID=88d022e97f75868e6967c259abf2708a&lat=${coords.lat}&lon=${coords.lon}`
        fetch(UrlForcastUV)
        .then(res => res.json())
        .then(data => {
            console.log("forcast weather UV")
            console.log(data)
            document.getElementById('UV').innerText ="UV Index: " + data.value
        })
        .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
}
