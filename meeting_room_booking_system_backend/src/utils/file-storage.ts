import * as multer from "multer";
import * as fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        try {
            fs.mkdirSync('uploads');
        }catch(e) {}

        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        const originalname = Buffer.from(file.originalname, 'latin1').toString('utf-8');
        const timestamp = Date.now();
        const randomSuffix = Math.round(Math.random() * 1E9);
        const uniqueSuffix = `${timestamp}-${randomSuffix}-${originalname}`;
        // const encodedFilename = encodeURIComponent(file.originalname);
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix)
    }
});

export { storage };