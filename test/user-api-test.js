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
    const returnedUser = await golfPOIService.createUser(authUser);
    const response = await golfPOIService.authenticate(authUser);
    await golfPOIService.deleteAllUsers();
    await golfPOIService.deleteOneUser(returnedUser._id)
  });

  suiteTeardown(async function () {
    await golfPOIService.deleteAllUsers();
    await golfPOIService.clearAuth();
  });

  setup(async function () {
    //await golfPOIService.deleteAllUsers();
  });

  teardown(async function () {
    //await golfPOIService.deleteAllUsers();
  });

  test("authenticate", async function () {
    const returnedUser = await golfPOIService.createUser(authUser);
    const response = await golfPOIService.authenticate(authUser);
    assert(response.success);
    assert.isDefined(response.token);
    await golfPOIService.deleteOneUser(returnedUser._id)
  });

  test("verify Token", async function () {
    const returnedUser = await golfPOIService.createUser(authUser);
    const response = await golfPOIService.authenticate(authUser);

    const userInfo = utils.decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
    await golfPOIService.deleteOneUser(returnedUser._id)
  });

  test("create a user", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);
    assert(_.some([returnedUser], newUser), "returnedUser must be a superset of newUser");
    assert.isDefined(returnedUser._id);
    await golfPOIService.deleteOneUser(returnedUser._id)
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
      await golfPOIService.authenticate(newUser);
    }

    const allUsers = await golfPOIService.getUsers();
    assert.equal(allUsers.length, users.length);

    for (let u of allUsers) {
        await golfPOIService.deleteOneUser(u._id)
    }
  });

  test("get users detail", async function () {
    let newUser;
    for (let u of users) {
      newUser = await golfPOIService.createUser(u);
      await golfPOIService.authenticate(newUser);
    }

    const allUsers = await golfPOIService.getUsers();
    for (let i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), "returnedUser must be a superset of newUser");
    }

    for (let u of allUsers) {
      await golfPOIService.deleteOneUser(u._id)
    }
  });

  test("get all users empty", async function () {
    const u1 = await golfPOIService.createUser(newUser);
    const response = await golfPOIService.authenticate(newUser);
    const allUsers = await golfPOIService.getUsers();
    assert.equal(allUsers.length, 1);
  });
});