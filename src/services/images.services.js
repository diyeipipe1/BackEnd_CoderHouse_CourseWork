import fs from "fs";

const ImageService = (filePath, file) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, file.buffer, (err) => {
            if (err) {
                console.error("The document had an error", file.originalname, err);
                resolve(false); // Resolving with false indicates failure
            } else {
                console.log("The file was saved successfully");
                resolve(true); // Resolving with true indicates success
            }
        });
    });
};

export default ImageService;