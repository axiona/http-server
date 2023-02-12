import Number from "@alirya/number/boolean/number.js";
import {ExistsParameters} from "@alirya/object/property/boolean/exists.js";
import String from "@alirya/string/boolean/string.js";
import Nullable from "@alirya/null/boolean/nullable.js";
import FileType from '../file.js';
import Object_ from '@alirya/object/boolean/object.js';

export default function File(value: object) : value is FileType {

    if(!Object_(value)) {

        return false;
    }

     if(!ExistsParameters(value, 'size') || !Number(value.size)) {

         return false;
     }

     // string
    for(const key of ['filepath', 'newFilename']) {

        if(!ExistsParameters(value, key) || !String(value[key])) {

            return false;
        }
    }

    // string & null
    for(const key of ['hash', 'originalFilename', 'mimetype', 'extension']) {

        if(!ExistsParameters(value, key) || !Nullable(value[key], String)) {

            return false;
        }
    }

    // string & false
    for(const key of ['hashAlgorithm']) {

        if(!ExistsParameters(value, key)) {

            return false;
        }

        if(!String(value[key]) && (value[key] !== false)) {

            return false;
        }

    }

    return true;
}