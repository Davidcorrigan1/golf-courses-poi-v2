const GolfPOIs = require('./app/api/golfPOIs');
const Users = require('./app/api/users');
const LocationCategory = require('./app/api/locationCategories');
const WeatherAPI = require('./app/api/weatherAPI');
const ImageAPI = require('./app/api/imageAPI');

module.exports = [
  { method: 'GET', path: '/api/golfPOIs', config: GolfPOIs.find },
  { method: "GET", path: "/api/golfPOIs/{id}", config: GolfPOIs.findOne },
  { method: "GET", path: "/api/golfPOIs/findByCategory/{categoryId}", config: GolfPOIs.findByCategory },
  { method: "POST", path: "/api/golfPOIs/update/{courseId}/{id}", config: GolfPOIs.update },
  { method: "POST", path: "/api/golfPOIs/upload/{id}", config: GolfPOIs.uploadImage },
  { method: 'DELETE', path: '/api/golfPOIs/deleteImage/{id}/{courseId}/{userId}', config: GolfPOIs.deleteImage },
  { method: 'POST', path: '/api/golfPOIs', config: GolfPOIs.create },
  { method: "DELETE", path: "/api/golfPOIs/{id}", config: GolfPOIs.deleteOne },
  { method: "DELETE", path: "/api/golfPOIs", config: GolfPOIs.deleteAll },

  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
  { method: "GET", path: "/api/users/email/{email}", config: Users.findByEmail },
  { method: "POST", path: "/api/users/update/{id}", config: Users.update },
  { method: "POST", path: "/api/users/authenticate", config: Users.authenticate },
  { method: "POST", path: "/api/users/create", config: Users.create },
  { method: "DELETE", path: "/api/users/{id}", config: Users.deleteOne },
  { method: "DELETE", path: "/api/users", config: Users.deleteAll },

  { method: "GET", path: "/api/locationCategories", config: LocationCategory.find },
  { method: "GET", path: "/api/locationCategories/{id}", config: LocationCategory.findOne },
  { method: "POST", path: "/api/locationCategories", config: LocationCategory.create },
  { method: "DELETE", path: "/api/locationCategories/{id}", config: LocationCategory.deleteOne },
  { method: "DELETE", path: "/api/locationCategories", config: LocationCategory.deleteAll },

  { method: "GET", path: "/api/imageAPI/{idList}", config: ImageAPI.getCourseImages },

  { method: "GET", path: "/api/weatherAPI/{latitude}/{longitude}", config: WeatherAPI.getWeather },
];