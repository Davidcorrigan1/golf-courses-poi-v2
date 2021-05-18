"use strict";

const assert = require("chai").assert;
const GolfPOIService = require("./golfPOI-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");
const utils = require("../app/api/utils.js");

suite("User API tests", function () {
  let users = fixtures.users;
  let newUser = fixtures.newUser;
  let authUser = fixtures.authUser;

  const golfPOIService = new GolfPOIService(fixtures.golfPOIService);

  suiteSetup(async function () {

  });

  suiteTeardown(async function () {


  });

  setup(async function () {
    const returnedUser = await golfPOIService.createUser(authUser);
    const response = await golfPOIService.authenticate(authUser);
  });

  teardown(async function () {
    await golfPOIService.deleteAllUsers();
    await golfPOIService.clearAuth();
  });

  test("authenticate", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);
    assert(response.success);
    assert.isDefined(response.token);
    await golfPOIService.deleteOneUser(returnedUser._id)
  });

  test("verify Token", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
    await golfPOIService.deleteOneUser(returnedUser._id)
  });

  test("create a user", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);
    assert.equal(returnedUser.email, newUser.email);
    assert.equal(returnedUser.userId, newUser._id);
    assert.equal(returnedUser.loginCount, newUser.loginCount);
    assert.equal(returnedUser.lastLoginDate, newUser.lastLoginDate);
    assert.equal(returnedUser.firstName, newUser.firstName);
    assert.equal(returnedUser.lastName, newUser.lastName);
    assert.isDefined(returnedUser._id);
  });

  test("get user", async function () {
    const u1 = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);
    const u2 = await golfPOIService.getUser(u1._id);
    assert.deepEqual(u1, u2);
    await golfPOIService.deleteOneUser(u1._id)
  });

  test("get invalid user", async function () {
    const u1 = await golfPOIService.getUser("1234");
    assert.isNull(u1);
    const u2 = await golfPOIService.getUser("012345678901234567890123");
    assert.isNull(u2);
  });

  test("delete a user", async function () {
    let u = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);
    assert(u._id != null);
    await golfPOIService.deleteOneUser(u._id);
    u = await golfPOIService.getUser(u._id);
    assert(u == null);
  });

  test("get all users", async function () {
    let newUser;
    for (let u of users) {
      newUser = await golfPOIService.createUser(u);
    }

    const allUsers = await golfPOIService.getUsers();
    assert.equal(allUsers.length, users.length+1);

    for (let u of allUsers) {
        await golfPOIService.deleteOneUser(u._id)
    }
  });

  test("get users detail", async function () {
    let newUser;

    await golfPOIService.deleteAllUsers();

    for (let u of users) {
      newUser = await golfPOIService.createUser(u);
      await golfPOIService.authenticate(u);
    }

    const allUsers = await golfPOIService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert.equal(allUsers[i].email, users[i].email);
      assert.equal(allUsers[i].userId, users[i]._id);
      assert.equal(allUsers[i].loginCount, users[i].loginCount);
      assert.equal(allUsers[i].lastLoginDate, users[i].lastLoginDate);
      assert.equal(allUsers[i].firstName, users[i].firstName);
      assert.equal(allUsers[i].lastName, users[i].lastName);
    }

  });

  test("get all users empty", async function () {
    await golfPOIService.deleteAllUsers();
    const u1 = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);
    const allUsers = await golfPOIService.getUsers();
    assert.equal(allUsers.length, 1);
  });

  test("Delete all users", async function () {
    let newUser;
    for (let u of users) {
      newUser = await golfPOIService.createUser(u);
    }

    let allUsers = await golfPOIService.getUsers();
    assert.equal(allUsers.length, users.length+1);

    await golfPOIService.deleteAllUsers();

    const returnedUser = await golfPOIService.createUser(authUser);
    const response = await golfPOIService.authenticate(authUser);

    allUsers = await golfPOIService.getUsers();
    assert.equal(allUsers.length, 1);
  });
});