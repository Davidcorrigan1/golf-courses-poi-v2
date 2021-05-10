'use strict';

const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
    configure: function() {
        const credentials = {
            cloud_name: process.env.name,
            api_key: process.env.key,
            api_secret: process.env.secret
        };
        cloudinary.config(credentials);
    },

    getAllImages: async function() {
        const images = await cloudinary.v2.api.resources();
        return images.resources;
    },

    getCourseImages: async function(public_id_list) {
        const images = await cloudinary.v2.api.resources_by_ids(public_id_list)
        return images.resources;
    },

    uploadImage: async function(imagefile) {
        await writeFile('./public/temp.img', imagefile);
        const uploadResult = await cloudinary.uploader.upload('./public/temp.img');
        return uploadResult;
    },

    deleteImage: async function(id) {
        await cloudinary.v2.uploader.destroy(id, {});
    },

};

module.exports = ImageStore;
