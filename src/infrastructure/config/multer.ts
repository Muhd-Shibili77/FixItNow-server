import multer from 'multer'
import path from 'path';

const storagePath: string = path.join(__dirname, "../fileStorage/profilePic/");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,storagePath),
    filename:(req,file,cb)=>cb(null,Date.now() + '-' +  file.originalname),
        
})
const upload = multer({storage})

export default upload; 