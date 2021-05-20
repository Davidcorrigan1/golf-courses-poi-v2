"use strict";

const assert = require("chai").assert;
const GolfPOIService = require("./golfPOI-service");
const ImageStore = require("../app/utils/imageStore");
const fixtures = require("./fixtures.json");
const _ = require("lodash");
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

suite("golfPOI API tests", function () {

  let golfPOIs = fixtures.golfPOIs;
  let newGolfPOI = fixtures.newGolfPOI;
  let newCategory = fixtures.newLocationCategory;
  let newCategory2 = fixtures.newLocationCategory2;
  let newUser = fixtures.newUser;
  let authUser = fixtures.authUser;
  let updatedCategory = fixtures.updateLocationCategory;
  let updatedGolfPOI = fixtures.updateGolfPOI;

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
    await golfPOIService.deleteAllGolfPOIs();
    const returnedUser = await golfPOIService.createUser(authUser);
    const response = await golfPOIService.authenticate(authUser);
  });

  teardown(async function () {
    await golfPOIService.deleteAllLocationCategories();
    await golfPOIService.deleteAllGolfPOIs();
    await golfPOIService.deleteAllUsers();
    await golfPOIService.clearAuth();
  });

  test("Create golfPOI", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    const returnedCategory = await golfPOIService.createLocationCategory(newCategory);
    newGolfPOI.category = returnedCategory._id;
    newGolfPOI.lastUpdatedBy = returnedUser._id;

    const returnedGolfPOI = await golfPOIService.createPOI(newGolfPOI);
    assert(_.some([returnedGolfPOI], newGolfPOI), "returnedGolfPOI must be a superset of newGolfPOI");
    assert.isDefined(returnedGolfPOI._id);
  });

  test("get golfPOI", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    const returnedCategory = await golfPOIService.createLocationCategory(newCategory);
    newGolfPOI.category = returnedCategory._id;
    newGolfPOI.lastUpdatedBy = returnedUser._id;

    const golfPOI1 = await golfPOIService.createPOI(newGolfPOI);
    const golfPOI2 = await golfPOIService.getGolfPOI(golfPOI1._id);
    assert.deepEqual(golfPOI1, golfPOI2);
  });

  test("update golfPOI", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    updatedCategory.lastUpdatedBy = returnedUser._id;

    const returnedCategory = await golfPOIService.createLocationCategory(newCategory);
    const returnedCategory1 = await golfPOIService.createLocationCategory(updatedCategory);
    newGolfPOI.category = returnedCategory._id;
    newGolfPOI.lastUpdatedBy = returnedUser._id;
    updatedGolfPOI.category = returnedCategory1._id;
    updatedGolfPOI.lastUpdatedBy = returnedUser._id;

    const golfPOI1 = await golfPOIService.createPOI(newGolfPOI);
    const golfPOIUpdated = await golfPOIService.updateGolfPOI(golfPOI1._id, returnedUser._id, updatedGolfPOI);

    const golfPOI2 = await golfPOIService.getGolfPOI(golfPOIUpdated._id);
    assert.deepEqual(golfPOI2.courseName, updatedGolfPOI.courseName);
  });

  test("get invalid GolfPOI", async function () {
    const golfPOI1 = await golfPOIService.getGolfPOI("1234");
    assert.isNull(golfPOI1);
    const golfPOI2 = await golfPOIService.getGolfPOI("012345678901234567890123");
    assert.isNull(golfPOI2);
  });

  test("delete a GolfPOI", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    let category = await golfPOIService.createLocationCategory(newCategory);
    newGolfPOI.category = category._id;
    newGolfPOI.lastUpdatedBy = returnedUser._id;

    let golfPOI = await golfPOIService.createPOI(newGolfPOI);

    assert(golfPOI._id != null);
    await golfPOIService.deleteOneGolfPOI(golfPOI._id);
    golfPOI = await golfPOIService.getGolfPOI(golfPOI._id);
    assert(golfPOI == null);
  });

  test("get all GolfPOIs", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    let category = await golfPOIService.createLocationCategory(newCategory);

    for (let golfPOI of golfPOIs) {
      newGolfPOI.category = category._id;
      newGolfPOI.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createPOI(newGolfPOI);
    }

    const allGolfPOIs = await golfPOIService.getGolfPOIs();
    assert.equal(allGolfPOIs.length, golfPOIs.length);
  });

  test("get GolfPOI detail", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    let category = await golfPOIService.createLocationCategory(newCategory);
    newGolfPOI.category = category._id;
    newGolfPOI.lastUpdatedBy = returnedUser._id;

    for (let golfPOI of golfPOIs) {
      newGolfPOI.category = category._id;
      newGolfPOI.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createPOI(golfPOI);
    }

    const allGolfPOIs = await golfPOIService.getGolfPOIs();
    for (let i = 0; i < allGolfPOIs.length; i++) {
      assert(_.some([allGolfPOIs[i]], golfPOIs[i]), "returnedGolfPOI must be a superset of newGolfPOI");
    }
  });

  test("get all GolfPOIs empty", async function () {
    const allGolfPOIs = await golfPOIService.getGolfPOIs();
    assert.equal(allGolfPOIs.length, 0);
  });

  test("Delete all GolfPOIs", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    let category = await golfPOIService.createLocationCategory(newCategory);

    for (let golfPOI of golfPOIs) {
      newGolfPOI.category = category._id;
      newGolfPOI.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createPOI(newGolfPOI);
    }
    let allGolfPOIs = await golfPOIService.getGolfPOIs();
    assert.equal(allGolfPOIs.length, golfPOIs.length);

    await golfPOIService.deleteAllGolfPOIs();

    allGolfPOIs = await golfPOIService.getGolfPOIs();
    assert.equal(allGolfPOIs.length, 0);
  });

  test("Find GolfPOIs by category", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    let category = await golfPOIService.createLocationCategory(newCategory);

    for (let golfPOI of golfPOIs) {
      newGolfPOI.category = category._id;
      newGolfPOI.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createPOI(newGolfPOI);
    }
    let allGolfPOIs = await golfPOIService.getGolfPOIByCategory(category._id);

    assert.equal(allGolfPOIs.length, golfPOIs.length);

  });

  test("Find GolfPOIs by category - None found", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    let category = await golfPOIService.createLocationCategory(newCategory);
    let category2 = await golfPOIService.createLocationCategory(newCategory2);

    for (let golfPOI of golfPOIs) {
      newGolfPOI.category = category._id;
      newGolfPOI.lastUpdatedBy = returnedUser._id;
      await golfPOIService.createPOI(newGolfPOI);
    }
    let allGolfPOIs = await golfPOIService.getGolfPOIByCategory(category2._id);

    assert.equal(allGolfPOIs.length, 0);

  });

});