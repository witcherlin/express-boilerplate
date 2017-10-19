import path from 'path';
import uniqid from 'uniqid';
import multer, { diskStorage } from 'multer';

export default multer({
    storage: diskStorage({
        destination: (req, file, done) => {
            done(null, path.join(__dirname, '/../public/uploads'));
        },
        filename: (req, file, done) => {
            done(null, uniqid() + path.extname(file.originalname));
        }
    })
});
