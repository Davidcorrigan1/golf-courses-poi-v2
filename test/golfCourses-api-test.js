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
  let newUser = fixtures.newUser;
  let updatedCategory = fixtures.updateLocationCategory;
  let updatedGolfPOI = fixtures.updateGolfPOI;

  const golfPOIService = new GolfPOIService(fixtures.golfPOIService);

  setup(async function () {
    await golfPOIService.deleteAllLocationCategories();
    await golfPOIService.deleteAllUsers();
    await golfPOIService.deleteAllGolfPOIs();
  });

  teardown(async function () {
    await golfPOIService.deleteAllLocationCategories();
    await golfPOIService.deleteAllUsers();
    await golfPOIService.deleteAllGolfPOIs();
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
/*
  test("Uploading image", async function () {
    const returnedUser = await golfPOIService.createUser(newUser);
    newCategory.lastUpdatedBy = returnedUser._id;
    const returnedCategory = await golfPOIService.createLocationCategory(newCategory);
    newGolfPOI.category = returnedCategory._id;
    newGolfPOI.lastUpdatedBy = returnedUser._id;

    const returnedGolfPOI = await golfPOIService.createPOI(newGolfPOI);

    await readFile('./public/temp.img', imagefile);

    const testImage = await ImageStore.getCourseImages(fixtures.relatedImages[0]);

    const updatedCourse = await golfPOIService.uploadImage(returnedGolfPOI._id, testImage);

    assert(_.some(updatedCourse, newGolfPOI), "Returned course must be the same as updated course");



  });

 */

});