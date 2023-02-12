import Formidable from "formidable";
import File from './file.js';
import FileType from "file-type";
import {extension} from "mime-types";

const {fromFile} = FileType;
type FormidableFile = Formidable.File;

export default async function FromFormidable(file: FormidableFile|File) : Promise<File> {

    if((file as File).extension === undefined) {

        Object.assign(file, {extension:null});
    }


    if(!file.mimetype) {

        const result = await fromFile(file.filepath);

        if(result) {

            Object.assign(file, {
                extension: result.ext,
                mimetype: result.mime,
            });
        }
    }

    if(file.mimetype && !(file as File).extension) {

        const ext = extension(file.mimetype);

        if(ext) {

            (file as File).extension = ext;
        }
    }

    return file as File;
}