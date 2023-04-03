// API key for OpenWeatherMap API
const API_KEY = "717be41e5c94602a91025296855d762a";

// Selecting the necessary HTML elements
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const currentWeather = document.querySelector("#current-weather");
const forecastWeather = document.querySelector("#forecast-weather");
const searchHistory = document.querySelector("#search-history");

// Function to handle search form submission
function handleSearchForm(event) {
  event.preventDefault();
  const searchQuery = searchInput.value;
  if (!searchQuery) return;
  searchCity(searchQuery);
  searchInput.value = "";
}

// Function to search for a city's weather
async function searchCity(city) {
  try {
    // Fetching current weather data for the city
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=imperial`
    );
    const data = await response.json();

    // Creating HTML elements to display current weather data
    const cityNameElement = document.createElement("h2");
    cityNameElement.innerHTML = data.name;

    const dateElement = document.createElement("p");
    const currentDate = new Date();
    dateElement.innerHTML = currentDate.toDateString();

    const weatherIconElement = document.createElement("img");
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `http://openweathermap.org/img/w/${iconCode}.png`;

    const temperatureElement = document.createElement("p");
    temperatureElement.innerHTML = `Temperature: ${data.main.temp} &deg;F`;

    const humidityElement = document.createElement("p");
    humidityElement.innerHTML = `Humidity: ${data.main.humidity}%`;

    const windSpeedElement = document.createElement("p");
    windSpeedElement.innerHTML = `Wind Speed: ${data.wind.speed} mph`;

    // Appending current weather elements to the DOM
    currentWeather.innerHTML = "";
    currentWeather.append(cityNameElement, dateElement, weatherIconElement, temperatureElement, humidityElement, windSpeedElement);

    // Fetching 5-day forecast data for the city
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`
    );
    const forecastData = await forecastResponse.json();

    // Creating HTML elements to display forecast weather data
    const forecastTitle = document.createElement("h3");
    forecastTitle.innerHTML = "5-Day Forecast:";

    const forecastRow = document.createElement("div");
    forecastRow.classList.add("row");

    forecastWeather.innerHTML = "";
    forecastWeather.append(forecastTitle, forecastRow);

    const forecastDays = forecastData.list.filter((reading) =>
      reading.dt_txt.includes("12:00:00")
    );

    forecastDays.forEach((day) => {
      const forecastCol = document.createElement("div");
      forecastCol.classList.add("col-md-2");

      const forecastCard = document.createElement("div");
      forecastCard.classList.add("card", "bg-primary", "text-white");

      const forecastCardBody = document.createElement("div");
      forecastCardBody.classList.add("card-body", "p-2");

      const forecastDate = document.createElement("p");
      forecastDate.innerHTML = new Date(day.dt_txt).toLocaleDateString();

      const forecastIcon = document.createElement("img");
      forecastIcon.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`;

      const forecastTemp = document.createElement("p");
      forecastTemp.innerHTML = `Temp: ${day.main.temp_max} &deg`;
      const forecastHumidity = document.createElement("p");
      forecastHumidity.innerHTML = `Humidity: ${day.main.humidity}%`;

      forecastCardBody.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
      forecastCard.append(forecastCardBody);
      forecastCol.append(forecastCard);
      forecastRow.append(forecastCol);
    });

    // Creating HTML elements to display search history
    const searchHistoryItem = document.createElement("button");
    searchHistoryItem.classList.add("btn", "btn-secondary", "btn-block", "text-left");
    searchHistoryItem.type = "button";
    searchHistoryItem.innerHTML = city;
    searchHistoryItem.addEventListener("click", () => searchCity(city));

    searchHistory.append(searchHistoryItem);
  } catch (error) {
    console.log(error);
    alert("Unable to retrieve weather data. Please try again.");
  }
}

// Event listener for search form submission
searchForm.addEventListener("submit", handleSearchForm);

      
      
