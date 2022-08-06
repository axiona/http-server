import {errors} from "formidable";
import {ExistsParameters} from "../../../../object/dist/property/boolean/exists";
import String from "../../../../string/dist/boolean/string";
import Number from "../../../../number/dist/boolean/number";

// fix incorrect @types
export type FormidableErrorType = Omit<InstanceType<typeof errors.FormidableError>, 'internalCode'> & {
    code: number
};

export default function FormidableError(error: object) : error is FormidableErrorType {

    if(error instanceof errors.FormidableError) {

        return true;
    }

    if(!(error instanceof Error)) {

        return false;
    }


    // number
    for(const key of ['code', 'httpCode']) {

        if(!ExistsParameters(error, key) || !Number(error[key])) {

            return false;
        }
    }

    // string
    for(const key of ['stack', 'message']) {

        if(!ExistsParameters(error, key) || !String(error[key])) {

            return false;
        }
    }


    return true;

}