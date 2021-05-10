"use strict";

const Accounts = require("./app/controllers/accounts");
const GolfPOIMaintenance = require("./app/controllers/golfPOIMaintenance");
const AdminFunction = require("./app/controllers/adminFunction");

module.exports = [
  { method: "GET", path: "/", config: Accounts.index },
  { method: "GET", path: "/signup", config: Accounts.showSignup },
  { method: "GET", path: "/login", config: Accounts.showLogin },
  { method: "GET", path: "/logout", config: Accounts.logout },
  { method: "POST", path: "/signup", config: Accounts.signup },
  { method: "POST", path: "/login", config: Accounts.login },
  { method: 'GET', path: '/settings', config: Accounts.showSettings },
  { method: 'POST', path: '/settings', config: Accounts.updateSettings },
  { method: 'POST', path: '/courseUpdate/{courseId}', config: GolfPOIMaintenance.updateCourse },
  { method: "GET", path: "/newCourse", config: GolfPOIMaintenance.newCourse },
  { method: "POST", path: "/addCourse", config: GolfPOIMaintenance.addCourse },
  { method: "GET", path: "/deleteCourse/{courseId}", config: GolfPOIMaintenance.deleteCourse },
  { method: "GET", path: "/addImage/{courseId}", config: GolfPOIMaintenance.addImage },
  { method: "GET", path: "/course/{courseId}", config: GolfPOIMaintenance.course },
  { method: "GET", path: "/report", config: GolfPOIMaintenance.report },
  { method: 'POST', path: '/uploadFile/{id}', config: GolfPOIMaintenance.uploadFile },
  { method: 'GET', path: '/deleteimage/{id}/{courseId}', config: GolfPOIMaintenance.deleteImage },
  { method: 'GET', path: '/category', config: GolfPOIMaintenance.showCategory },
  { method: 'POST', path: '/category', config: GolfPOIMaintenance.updateCategory },
  { method: "GET", path: '/deleteCategory/{categoryId}', config: GolfPOIMaintenance.deleteCategory },
  { method: "GET", path: '/manageUsers', config: AdminFunction.manageUsers },
  { method: "GET", path: '/deleteUser/{id}', config: AdminFunction.deleteUser },
  { method: "GET", path: '/userUpdate/{id}', config: AdminFunction.displayUser },
  { method: "POST", path: '/userUpdate/{id}', config: AdminFunction.updateUser },
  { method: "GET", path: "/reportCategory/{categoryId}", config: GolfPOIMaintenance.reportCategory },

  {
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: "./public",
      },
    },
    options: { auth: false },
  },
];
