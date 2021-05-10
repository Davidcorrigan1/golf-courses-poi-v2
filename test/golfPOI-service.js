"use strict";

const axios = require("axios");

class GolfPOIService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  //-----------------------------------------------------------------------------------------------------------
  // User Functions...
  //-----------------------------------------------------------------------------------------------------------
  async getUsers() {
    try {
      const response = await axios.get(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getUser(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createUser(newUser) {
    try {
      const response = await axios.post(this.baseUrl + "/api/users/create", newUser);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllUsers() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneUser(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/users/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  //-----------------------------------------------------------------------------------------------------------
  // LocationCategory Functions.....
  //-----------------------------------------------------------------------------------------------------------

  async getLocationCategories() {
    try {
      const response = await axios.get(this.baseUrl + "/api/locationCategories");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getLocationCategory(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/locationCategories/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createLocationCategory(newLocationCategory) {
    try {
      const response = await axios.post(this.baseUrl + "/api/locationCategories", newLocationCategory);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteAllLocationCategories() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/locationCategories");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneLocationCategory(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/locationCategories/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  //-----------------------------------------------------------------------------------------------------------
  //GolfPOI Functions...
  //-----------------------------------------------------------------------------------------------------------
  async getGolfPOIs() {
    try {
      const response = await axios.get(this.baseUrl + "/api/golfPOIs");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async getGolfPOI(id) {
    try {
      const response = await axios.get(this.baseUrl + "/api/golfPOIs/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }


  async updateGolfPOI(courseId, userId, updatedGolfPOI) {
    try {
      const url = this.baseUrl + "/api/golfPOIs/update/" + courseId + "/" + userId;
      console.log(url);
      const response = await axios.post(this.baseUrl + "/api/golfPOIs/update/" + courseId + "/" + userId, updatedGolfPOI);
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async createPOI(newGolfPOI) {
    const response = await axios.post(this.baseUrl + "/api/golfPOIs", newGolfPOI);
    return response.data;
  }

  async uploadImage(id, imageFile) {
    const response = await axios.post(this.baseUrl + "/api/golfPOIs" + id, imageFile);
    return response.data;
  }

  async deleteAllGolfPOIs() {
    try {
      const response = await axios.delete(this.baseUrl + "/api/golfPOIs");
      return response.data;
    } catch (e) {
      return null;
    }
  }

  async deleteOneGolfPOI(id) {
    try {
      const response = await axios.delete(this.baseUrl + "/api/golfPOIs/" + id);
      return response.data;
    } catch (e) {
      return null;
    }
  }
}

module.exports = GolfPOIService;