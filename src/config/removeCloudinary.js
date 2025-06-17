const cloudinary = require("../config/cloudinary");

const extractPublicId = (url) => {
  const regex = /\/([^/]+)\?/; // regex untuk mencari public id di URL
  const match = url.match(regex);
  return match ? match[1] : null;
};

const removeCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
};
