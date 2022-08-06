import {File as FormidableFile} from "formidable";


export type File = Omit<FormidableFile, 'mtime'> & {
    extension: string|null
};

export default File;