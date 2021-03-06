
// create variable the holds the value will be used in localstorage
// first thing is to try to load the local storage
let cityNameList = []
loadStorage();

// when search botton clicked, find all the weather related value.
document.getElementById('getWeatherBtn').addEventListener('click', function(event){

    event.preventDefault();
    let cityName = document.getElementById('cityNameInput').value;
    let UrlForcastWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=88d022e97f75868e6967c259abf2708a`
    let UrlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=88d022e97f75868e6967c259abf2708a`

    findForcastWeather(UrlForcastWeather)
    findCurrentWeather(UrlCurrentWeather)

});

// when the city name in the list get clicked, find all the weather related value
let cityListItems = document.getElementById('cityList')
cityListItems.addEventListener('click', function(event){

    let cityListItems = document.querySelectorAll('li')
    cityListItems.forEach(element => {
        element.setAttribute('class', 'list-group-item list-group-item-action')
    });
    event.target.setAttribute('class', 'list-group-item list-group-item-action active');

    console.log(this)
    let selectedCityName = event.target.getAttribute('value');
    let UrlForcastWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCityName}&APPID=88d022e97f75868e6967c259abf2708a`;
    let UrlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${selectedCityName}&APPID=88d022e97f75868e6967c259abf2708a`;

    findForcastWeather(UrlForcastWeather)
    findCurrentWeather(UrlCurrentWeather)
})


// function that handles finding the future weather
function findForcastWeather(UrlForcastWeather){
    fetch(UrlForcastWeather)
    .then(res => res.json())
    .then(data => {
        if(data.cod == 200)
        {
            console.log("forcast weather")
            console.log(data)
            // store the weather of future 5 days in to an array 
            let fiveDaysWeatherObjs = [data.list[7],data.list[15],data.list[23],data.list[31],data.list[39]]
            console.log(fiveDaysWeatherObjs)

            fiveDaysWeatherObjs.forEach(function(element,index){
                // parse value from the resposne
                let dateTitle = element.dt_txt.substring(0, 10);
                let weatherIcon = element.weather[0].icon;
                let temp = (element.main.temp - 273.15).toFixed(2);
                let humidity = element.main.humidity;
                // create dom element related to forcast weather
                let weatherTitleDiv = document.createElement('div')
                let weatherIconImg= document.createElement('img')
                let weatherTempDiv = document.createElement('div')
                let weatherHumidityDiv = document.createElement('div')
                // get image from open weather
                weatherTitleDiv.setAttribute('class','h5');
                weatherTitleDiv.innerText = dateTitle;
                weatherIconImg.setAttribute("src", `https://openweathermap.org/img/wn/${weatherIcon}.png`);
                weatherTempDiv.innerText = "Temp: " + temp + "°C";
                weatherHumidityDiv.innerText = "Humidity: " + humidity + "%";

                // append all the childs
                let elementID = 'day'+ index;
                let currentWeatherContent = document.getElementById(elementID);
                currentWeatherContent.innerHTML = '';
                currentWeatherContent.setAttribute('class',"m-2 col bg-primary text-white weatherForcast");
                currentWeatherContent.appendChild(weatherTitleDiv);
                currentWeatherContent.appendChild(weatherIconImg);
                currentWeatherContent.appendChild(weatherTempDiv);
                currentWeatherContent.appendChild(weatherHumidityDiv);

            });
        }
    })
    .catch(err => {
        console.error(err)
    });
}
// function that handles finding current weather infomation
function findCurrentWeather(UrlCurrentWeather){
    fetch(UrlCurrentWeather)
    .then(res => res.json())
    .then(data => {
        console.log("current weather")  
        console.log(data)
        if(data.cod === 200)
        {
            // find image from open weather website 
            let iconURL = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            console.log(iconURL)
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute('src',iconURL);
            weatherIcon.setAttribute('alt',"weatherIcon");
            // create all the dom element
            document.getElementById('weatherCondition').innerHTML = '';
            document.getElementById('weatherCondition').appendChild(weatherIcon);
            document.getElementById('cityName').innerText = data.name;
            document.getElementById('temperature').innerText = String((data.main.temp - 273.15).toFixed(1));
            document.getElementById('humidity').innerText = String(data.main.humidity);
            document.getElementById('windSpeed').innerText = String(data.wind.speed);
            localStorage.setItem('activeCityName', data.name);
            if (!cityNameList.includes(data.name))
            {
                cityNameList.push(data.name)
                localStorage.setItem('cityNameList', cityNameList)
                let cityListItems = document.querySelectorAll('li')
                cityListItems.forEach(element => {
                    element.setAttribute('class', 'list-group-item list-group-item-action')
                });
            
                let newListItem = document.createElement('li');
                newListItem.setAttribute('href','#');
                newListItem.setAttribute('class', 'list-group-item list-group-item-action active');
                newListItem.setAttribute('value', data.name);
                newListItem.innerText = data.name
                document.getElementById('cityList').appendChild(newListItem);
            }
            return data.coord
        }
        else{
            alert("Please enter correct city name.")
        }// find the UV Index for the city
    }).then(coords =>{
        if (coords != undefined)
        {
            let UrlForcastUV = `https://api.openweathermap.org/data/2.5/uvi?APPID=88d022e97f75868e6967c259abf2708a&lat=${coords.lat}&lon=${coords.lon}`
            fetch(UrlForcastUV)
            .then(res => res.json())
            .then(data => {
                console.log("forcast weather UV")
                console.log(data)
                document.getElementById('UV').innerText = data.value
                // based on the UV value. change the background color.
                if (data.value < 3)
                {
                    document.getElementById('UV').setAttribute('class','bg-success text-light');
                }
                else if (data.value < 7)
                {
                    document.getElementById('UV').setAttribute('class','bg-warning text-light');
                }
                else
                {
                    document.getElementById('UV').setAttribute('class','bg-danger text-light');
                }
            });
        }
    })
    .catch(err => {
        console.error(err)
    });
}

// function thant handles loading local storage
function loadStorage()
{
    let cityNameListString = localStorage.getItem('cityNameList')
    let activeCityName = localStorage.getItem('activeCityName')
    if (cityNameListString)
    {
        let cityNameListArray = cityNameListString.split(",");
        cityNameList = cityNameListArray;
        cityNameListArray.forEach(element => {
            let listItem = document.createElement('li');
            listItem.setAttribute('href','#');
            listItem.setAttribute('class', 'list-group-item list-group-item-action');
            listItem.setAttribute('value', element);
            listItem.innerText = element
            document.getElementById('cityList').appendChild(listItem);
        });
    }

    if(activeCityName)
    {
        let cityListItems = document.querySelectorAll('li')
        cityListItems.forEach(element => {
            if (element.getAttribute('value') == activeCityName)
            {
                element.setAttribute('class', 'list-group-item list-group-item-action active')
            }
        });
        // when app loads, based on the localstorage, display the weather of the active selected city. 
        let UrlForcastWeather = `https://api.openweathermap.org/data/2.5/forecast?q=${activeCityName}&APPID=88d022e97f75868e6967c259abf2708a`;
        let UrlCurrentWeather = `https://api.openweathermap.org/data/2.5/weather?q=${activeCityName}&APPID=88d022e97f75868e6967c259abf2708a`;

        findForcastWeather(UrlForcastWeather)
        findCurrentWeather(UrlCurrentWeather)
    }

}
