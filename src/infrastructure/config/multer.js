import multer from 'multer'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storagePath = join(__dirname, '../fileStorage/profilePic/');




const storage = multer.diskStorage({
    destination:(req,file,cb)=>cb(null,storagePath),
    filename:(req,file,cb)=>cb(null,Date.now() + '-' +  file.originalname),
        
})
const upload = multer({storage})

export default upload; 