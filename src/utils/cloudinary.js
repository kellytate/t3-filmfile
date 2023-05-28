/* eslint-disable @typescript-eslint/no-unsafe-call */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudinary = require('cloudinary-react').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET, 
});

/**
 * @param {any} imageUploaded
 */
export function uploadedImage(imageUploaded) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(imageUploaded, 
        // { width: 400, height: 300, crop: "fill"},
        (/** @type {any} */ error, /** @type {any} */ result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}
