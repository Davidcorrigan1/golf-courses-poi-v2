'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);
const Boom = require("@hapi/boom");

const ImageStore = {
    configure: {
        auth: false,
        handler: async function(request, h) {
            const credentials = {
                cloud_name: process.env.name,
                api_key: process.env.key,
                api_secret: process.env.secret
            };
            cloudinary.config(credentials);
        }
    },

    getAllImages: {
        auth: false,
        handler: async function(request, h) {
            const images = await cloudinary.v2.api.resources();
            return images.resources;
        }
    },

    getCourseImages: {
        auth: false,
        handler: async function(request, h) {
            const public_id_list = request.params.idList;
            const images = await cloudinary.v2.api.resources_by_ids(public_id_list)
            return images.resources;
        }
    },

    uploadImage: {
        auth: false,
        handler: async function(request, h) {
            await writeFile('./public/temp.img', imagefile);
            const uploadResult = await cloudinary.uploader.upload('./public/temp.img');
            return uploadResult;
        }
    },

    deleteImage: {
        auth: false,
        handler: async function(request, h) {
            await cloudinary.v2.uploader.destroy(id, {});
        }
    },

};

module.exports = ImageStore;
