'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const Boom = require("@hapi/boom");
const url = require('url');
const ba64 = require("ba64");

const ImageAPI = {
    configure: function() {
        const credentials = {
            cloud_name: process.env.name,
            api_key: process.env.key,
            api_secret: process.env.secret
        };
        cloudinary.config(credentials);
    },

    getAllImages: {
        auth: {
            strategy: "jwt",
        },
        handler: async function(request, h) {
            const images = await cloudinary.v2.api.resources();
            return images.resources;
        }
    },

    getCourseImages: {
        auth: {
            strategy: "jwt",
        },
        handler: async function(request, h) {
            const public_id_list = request.params.idList;
            let public_id_array = public_id_list.split(',');
            const images = await cloudinary.v2.api.resources_by_ids(public_id_array)
            return images.resources;
        }
    },

    deleteImage: {
        auth: {
            strategy: "jwt",
        },
        handler: async function(request, h) {
            await cloudinary.v2.uploader.destroy(id, {});
        }
    },

};

module.exports = ImageAPI;
