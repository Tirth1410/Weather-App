// API LINK : https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+API_KEY BY CITY
// API LINK : "https://api.openweathermap.org/data/2.5/weather?lat="+latitude+"&lon="+longitude+"&appid="+API_KEY+"&units=metric" BY Coordinates

const userTab = document.querySelector('[data-userWeather]');
const searchTab = document.querySelector('[data-searchWeather]');
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorContainer = document.querySelector(".error-container");

// INITIAL VARIABLES
let currentTab = userTab;
const API_KEY = "182ae2910d93f81d4a72e1292a67307e";
currentTab.classList.add("current-tab");
errorContainer.classList.remove("active");
getFromSessionStorage();

// SWITCH FUNCTION
function switchTab(clickedTab){
    errorContainer.classList.remove("active");
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab")

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        } else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}

// // get coordinates from CURRENT SESSION
function getFromSessionStorage(){
    // console.log('Session Storage');
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    // console.log(localCoordinates);
    if(!localCoordinates){  
        grantAccessContainer.classList.add("active");
    } else{ 
        const coordinates = JSON.parse(localCoordinates);
        // console.log(typeof(coordinates));
        // console.log('Entering');
        fetchUserWeatherInfo(coordinates);
    }

}

// FUNCTION THAT FETCH THE WEATHER INFORMATION USING THE API

async function fetchUserWeatherInfo(coordinates){
    errorContainer.classList.remove("active");
    // alert('Inside Fetch Function');
    // console.log(coordinates.lat);
    // console.log(coordinates.longi);
    grantAccessContainer.classList.remove("active");

    // LOADING SCREEN VISIBLE
    loadingScreen.classList.add("active");

    // API CALL
    try{
        const response = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+coordinates.lat+"&lon="+coordinates.longi+"&appid=182ae2910d93f81d4a72e1292a67307e&units=metric");
        const data = await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    } catch(error){
        loadingScreen.classList.add("active");
    }
}

// SWITCHING BETWEEN TABS
userTab.addEventListener("click", () => {
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    switchTab(searchTab);
})


// TO RENDER THE INFORMATION ON THE WEBSITE
function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const Description = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const Temp = document.querySelector("[data-temp]");

    const windSpeed = document.querySelector("[data-windSpeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    // FETCHING THE CONTENT FROM THE API

    cityName.innerText = weatherInfo?.name; //NAME OF THE CITY
    countryIcon.src = "https://flagcdn.com/144x108/"+weatherInfo?.sys?.country.toLowerCase()+".png"; //FLAG OF COUNTRY
    Description.innerText = weatherInfo?.weather?.[0]?.description; //DESCRIPTION OF THE WEATHER
    weatherIcon.src = "http://openweathermap.org/img/w/"+weatherInfo?.weather?.[0]?.icon+".png"; //ICON OF WEATHER
    Temp.innerText = weatherInfo?.main?.temp+" ℃";

    windSpeed.innerText = weatherInfo?.wind?.speed+" m/s";
    humidity.innerText = weatherInfo?.main?.humidity+" %";
    cloudiness.innerText = weatherInfo?.clouds?.all+" %";
}

// FOR GETTING THE LOCATION OF THE USER
function getLocation(){
    if(navigator.geolocation){
        // console.log('Location  supported');
        navigator.geolocation.getCurrentPosition(showPosition);
    } else{
        console.log('Please allow access to location!!');
    }
}

function showPosition(position){
    // console.log('fetching the Location');
    const userCoordinates = {
        lat: position.coords.latitude.toFixed(3),
        longi: position.coords.longitude.toFixed(3)
    };

    
    // console.log(userCoordinates.lat);
    // console.log(userCoordinates.longi);
    // console.log(userCoordinates);
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    // console.log(userCoordinates);
    // console.log('Before Entering Function');
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation());

// FOR THE SEARCH OF CITY
const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;
    // console.log('City name ' + cityName);

    if(cityName === ""){
        return;
    } else {
        fetchUserWeatherInfoCity(cityName);
    }
});

async function fetchUserWeatherInfoCity(city){
    errorContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    
        let response = await fetch("https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid=182ae2910d93f81d4a72e1292a67307e&units=metric");
        let data = await response.json();

        if(data?.cod == "200"){
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        } else {
            loadingScreen.classList.remove("active");
            errorContainer.classList.add("active");
            alert('No Data Found');
        }
};
