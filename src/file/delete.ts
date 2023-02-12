import Fs from "fs";
import NoOp from "../../../function/dist/no-op.js";
import Formidable from "formidable";

type FormidableFile = Formidable.File;

export default function Delete(file : FormidableFile, errorHandler: (error)=>void = NoOp) : Promise<FormidableFile> {

    const absolute = file.filepath;

    return Fs.promises.unlink(absolute).catch(errorHandler).then(() => file);
}