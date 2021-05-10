const GolfPOIs = require('./app/api/golfPOIs');
const Users = require('./app/api/users');
const LocationCategory = require('./app/api/locationCategories');
const ImageStore = require('./app/api/imageStore');

module.exports = [
  { method: 'GET', path: '/api/golfPOIs', config: GolfPOIs.find },
  { method: "GET", path: "/api/golfPOIs/{id}", config: GolfPOIs.findOne },
  { method: "POST", path: "/api/golfPOIs/update/{courseId}/{id}", config: GolfPOIs.update },
  { method: "POST", path: "/api/golfPOIs/{id}", config: GolfPOIs.uploadImage },
  { method: 'GET', path: '/api/golfPOIs/{id}/{courseId}', config: GolfPOIs.deleteImage },
  { method: 'POST', path: '/api/golfPOIs', config: GolfPOIs.create },
  { method: "DELETE", path: "/api/golfPOIs/{id}", config: GolfPOIs.deleteOne },
  { method: "DELETE", path: "/api/golfPOIs", config: GolfPOIs.deleteAll },

  { method: "GET", path: "/api/users", config: Users.find },
  { method: "GET", path: "/api/users/{id}", config: Users.findOne },
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

  { method: "GET", path: "/api/imageStore", config: LocationCategory.find },
  { method: "GET", path: "/api/imageStore/{idList}", config: ImageStore.getCourseImages },
];