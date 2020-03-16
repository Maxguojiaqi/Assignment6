let cityNameList = []
loadStorage();

document.getElementById('getWeatherBtn').addEventListener('click', function(event){

    event.preventDefault();
    let cityName = document.getElementById('cityNameInput').value;
    let UrlForcastWeather = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&APPID=88d022e97f75868e6967c259abf2708a`
    let UrlCurrentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=88d022e97f75868e6967c259abf2708a`

    findForcastWeather(UrlForcastWeather)
    findCurrentWeather(UrlCurrentWeather)

});


let cityListItems = document.getElementById('cityList')
cityListItems.addEventListener('click', function(event){

    let cityListItems = document.querySelectorAll('li')
    cityListItems.forEach(element => {
        element.setAttribute('class', 'list-group-item list-group-item-action')
    });
    event.target.setAttribute('class', 'list-group-item list-group-item-action active');

    console.log(this)
    let selectedCityName = event.target.getAttribute('value');
    let UrlForcastWeather = `http://api.openweathermap.org/data/2.5/forecast?q=${selectedCityName}&APPID=88d022e97f75868e6967c259abf2708a`;
    let UrlCurrentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${selectedCityName}&APPID=88d022e97f75868e6967c259abf2708a`;

    findForcastWeather(UrlForcastWeather)
    findCurrentWeather(UrlCurrentWeather)
})



function findForcastWeather(UrlForcastWeather){
    fetch(UrlForcastWeather)
    .then(res => res.json())
    .then(data => {
        if(data.cod == 200)
        {
            console.log("forcast weather")
            let fiveDaysWeatherObjs = [data.list[7],data.list[15],data.list[23],data.list[31],data.list[39]]
            console.log(fiveDaysWeatherObjs)

            fiveDaysWeatherObjs.forEach(function(element,index){
                let dateTitle = element.dt_txt.substring(0, 10);
                let weatherIcon = element.weather[0].icon;
                let temp = (element.main.temp - 273.15).toFixed(2);
                let humidity = element.main.humidity;

                let weatherTitleDiv = document.createElement('div')
                let weatherIconImg= document.createElement('img')
                let weatherTempDiv = document.createElement('div')
                let weatherHumidityDiv = document.createElement('div')

                weatherTitleDiv.setAttribute('class','h5');
                weatherTitleDiv.innerText = dateTitle;
                weatherIconImg.setAttribute("src", `http://openweathermap.org/img/wn/${weatherIcon}.png`);
                weatherTempDiv.innerText = "Temp: " + temp + "°C";
                weatherHumidityDiv.innerText = "Humidity: " + humidity + "%";


                let elementID = 'day'+ index;
                let currentWeatherContent = document.getElementById(elementID);
                currentWeatherContent.innerHTML = '';
                currentWeatherContent.setAttribute('class',"m-2 col bg-primary text-white");
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

function findCurrentWeather(UrlCurrentWeather){
    fetch(UrlCurrentWeather)
    .then(res => res.json())
    .then(data => {
        console.log("current weather")  
        console.log(data)
        if(data.cod === 200)
        {
            let iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
            console.log(iconURL)
            let weatherIcon = document.createElement('img')
            weatherIcon.setAttribute('src',iconURL);
            weatherIcon.setAttribute('alt',"weatherIcon");
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
        }
    }).then(coords =>{
        if (coords != undefined)
        {
            let UrlForcastUV = `http://api.openweathermap.org/data/2.5/uvi?APPID=88d022e97f75868e6967c259abf2708a&lat=${coords.lat}&lon=${coords.lon}`
            fetch(UrlForcastUV)
            .then(res => res.json())
            .then(data => {
                console.log("forcast weather UV")
                console.log(data)
                document.getElementById('UV').innerText = data.value
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

        let UrlForcastWeather = `http://api.openweathermap.org/data/2.5/forecast?q=${activeCityName}&APPID=88d022e97f75868e6967c259abf2708a`;
        let UrlCurrentWeather = `http://api.openweathermap.org/data/2.5/weather?q=${activeCityName}&APPID=88d022e97f75868e6967c259abf2708a`;

        findForcastWeather(UrlForcastWeather)
        findCurrentWeather(UrlCurrentWeather)
    }

}
