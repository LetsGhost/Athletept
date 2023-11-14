import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'dist/public/uploads'); // Uploads will be stored in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const fileFilter = (req: any, file: any, cb: any) => {
    // Accept .xlsx files only
    if (!file.originalname.match(/\.(xlsx)$/)) { 
        return cb("No compatable file type.", false);
    }
    cb(null, true);
};

export const upload = multer({ storage: storage, fileFilter: fileFilter });