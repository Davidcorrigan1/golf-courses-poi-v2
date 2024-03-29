"use strict";

const assert = require("chai").assert;
const GolfPOIService = require("./golfPOI-service");
const fixtures = require("./fixtures.json");
const _ = require("lodash");

suite("LocationCategory API tests", function () {
  let categories = fixtures.locationCategories;
  let newCategory = fixtures.newLocationCategory;
  let newUser = fixtures.newUser;
  let authUser = fixtures.authUser;

  const golfPOIService = new GolfPOIService(fixtures.golfPOIService);

  suiteSetup(async function () {
    await golfPOIService.deleteAllUsers();
  });

  suiteTeardown(async function () {
    await golfPOIService.deleteAllUsers();
    await golfPOIService.clearAuth();
  });

  setup(async function () {
    await golfPOIService.deleteAllLocationCategories();
    const returnedUser = await golfPOIService.createUser(authUser);
    const response = await golfPOIService.authenticate(authUser);
  });

  teardown(async function () {
    await golfPOIService.deleteAllLocationCategories();
    await golfPOIService.deleteAllUsers();
    await golfPOIService.clearAuth();
  });

  test("create a Category", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    const returnedCategory = await golfPOIService.createLocationCategory(newCategory);
    assert(_.some([returnedCategory], newCategory), "returnedCategory must be a superset of newCategory");
    assert.isDefined(returnedCategory._id);
  });

  test("get Category", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    const category1 = await golfPOIService.createLocationCategory(newUser);
    const category2 = await golfPOIService.getLocationCategory(category1._id);
    assert.deepEqual(category1, category2);
  });

  test("get invalid category", async function () {
    const category1 = await golfPOIService.getLocationCategory("1234");
    assert.isNull(category1);
    const category2 = await golfPOIService.getLocationCategory("012345678901234567890123");
    assert.isNull(category2);
  });

  test("delete a Category", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    let category = await golfPOIService.createLocationCategory(newCategory);
    assert(category._id != null);
    await golfPOIService.deleteOneLocationCategory(category._id);
    category = await golfPOIService.getLocationCategory(category._id);
    assert(category == null);
  });

  test("get all categories", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);

    for (let category of categories) {
      category.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createLocationCategory(category);
    }

    const allCategories = await golfPOIService.getLocationCategories();
    assert.equal(allCategories.length, categories.length);
  });

  test("get Category detail", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);

    for (let category of categories) {
      category.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createLocationCategory(category);
    }

    const allCategories = await golfPOIService.getLocationCategories();
    for (let i = 0; i < allCategories.length; i++) {
      assert.deepEqual(allCategories[i].validCounties, categories[i].validCounties);
      assert.deepEqual(allCategories[i].province, categories[i].province);
    }
  });

  test("get all categories empty", async function () {
    const allCategories = await golfPOIService.getLocationCategories();
    assert.equal(allCategories.length, 0);
  });

  test("Delete all categories", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);

    for (let category of categories) {
      category.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createLocationCategory(category);
    }

    let allCategories = await golfPOIService.getLocationCategories();
    assert.equal(allCategories.length, categories.length);

    await golfPOIService.deleteAllLocationCategories();
    allCategories = await golfPOIService.getLocationCategories();
    assert.equal(allCategories.length, 0);

  });
});