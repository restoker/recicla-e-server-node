// const { Storage } = require('@google-cloud/storage');
// const { format } = require('util');
// const url = require('url');
// const { v4: uuidv4 } = require('uuid');
// const uuid = uuidv4();
import storageservices from '@google-cloud/storage';
import { format } from 'util';
import url from 'url';
// const env = require('../config/env')
import { v4 as uuidv4 } from 'uuid';
const uuid = uuidv4();
const { Storage } = storageservices;

const storage = new Storage({
    projectId: "reciclon-4e383",
    keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("gs://reciclon-4e383.appspot.com/");

/**
 * Subir el archivo a Firebase Storage
 * @param {File} file objeto que sera almacenado en Firebase Storage
 */

const storageFile = (file, pathImage, deletePathImage) => {
    return new Promise((resolve, reject) => {

        console.log('delete path', deletePathImage)
        if (deletePathImage) {

            if (deletePathImage != null || deletePathImage != undefined) {
                const parseDeletePathImage = url.parse(deletePathImage)
                var ulrDelete = parseDeletePathImage.pathname.slice(23);
                const fileDelete = bucket.file(`${ulrDelete}`)

                fileDelete.delete().then((imageDelete) => {

                    console.log('se borro la imagen con exito')
                }).catch(err => {
                    console.log('Failed to remove photo, error:', err)
                });

            }
        }


        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {

                let fileUpload = bucket.file(`${pathImage}`);
                let stream = fileUpload.createWriteStream();
                const blobStream = stream.pipe(fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            firebaseStorageDownloadTokens: uuid,
                        }
                    },
                    resumable: false

                }));

                blobStream.on('error', (error) => {
                    console.log('Error al subir archivo a firebase', error);
                    reject('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', () => {
                    // The public URL can be used to directly access the file via HTTP.
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    console.log('URL DE CLOUD STORAGE ', url);
                    // const urlAlt = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${carpetaName}%${fileUpload.name}?alt=media&token=fdf734ee-0070-4691-891e-08bdd8304ca0`)
                    resolve(url);
                });

                blobStream.end(file.buffer);
            }
        }
    });
}

export default storageFile;