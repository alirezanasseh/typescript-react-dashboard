/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param {String} fileName - Name of the returned file in Promise
 */
import {Crop} from 'react-image-crop';

export function getCroppedImg(image: HTMLImageElement, crop: Crop, fileName: string): Promise<Blob> {
    if(!crop.width) crop.width = 250;
    if(!crop.height) crop.height = 250;
    if(!crop.x) crop.x = 0;
    if(!crop.y) crop.y = 0;

    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if(ctx){
        // New lines to be added
        const pixelRatio = window.devicePixelRatio;
        canvas.width = crop.width * pixelRatio;
        canvas.height = crop.height * pixelRatio;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        );
    }

    // As Base64 string
    // const base64Image = canvas.toDataURL("image/jpeg");
    // return base64Image;

    // As a blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                let resultBlob = blob as Blob & {name: string};
                if(resultBlob){
                    resultBlob.name = fileName;
                }
                resolve(resultBlob);
            },
            "image/jpeg",
            1
        );
    });
}
