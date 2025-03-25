import multer from "multer";
import cloudinary from "./cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "serviceImages",
    format: file.mimetype.split("/")[1], 
    resource_type: file.mimetype.startsWith("video") ? "video" : "image",
  }),
});

const serviceIconUpload = multer({ storage });

export default serviceIconUpload;
