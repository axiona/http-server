import Formidable from "formidable";

type FormidableFile = Formidable.File;


export type File = Omit<FormidableFile, 'mtime'> & {
    extension: string|null
};

export default File;