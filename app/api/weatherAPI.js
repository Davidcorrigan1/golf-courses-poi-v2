const axios = require("axios");
const env = require('dotenv');
const Boom = require("@hapi/boom");

//-------------------------------------------------------------------------------------------------
// The getWeather(long,lat) will use the open weather api to retrieve weather at given longitude
// and latitude coordinates. It will return a weather object with details.
//-------------------------------------------------------------------------------------------------

const WeatherAPI = {
  getWeather: {
    auth: {
      strategy: "jwt",
    },
    handler: async function(request, h) {
      const lon = request.params.longitude;
      const lat = request.params.latitude;
      const apiKey = process.env.api_key
      try {
        const weatherRequest = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        let weather = {};
        const response = await axios.get(weatherRequest);
        if (response.status == 200) {
          weather = response.data
          console.log("Weather:" + weather.weather[0].description);
        } else {
          return Boom.notFound("No Weather found at these coordinates");
        };
        return weather;
      } catch (err) {
        return Boom.notFound("No GolfPOI with this id");
        let weather = {};
        return weather;
      }
    }
  }
};

module.exports = WeatherAPI;
