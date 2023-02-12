import Function from '@alirya/function/boolean/function.js';
import {ExistsParameters} from '@alirya/object/property/boolean/exists.js';
import Middleware from '../middleware.js';
import {PathReturn} from '../path.js';
import String from '@alirya/string/boolean/string.js';


export default function Path<Type extends Middleware>(type: Type) : type is Type & PathReturn {

    if(!Function(type)) {

        return false;
    }

    if(!ExistsParameters(type, 'paths') || !Array.isArray(type.paths)) {

        return false;
    }

    if(!ExistsParameters(type, 'path') || !String(type.path)) {

        return false;
    }

    if(!ExistsParameters(type, 'matchers')) {

        return false;
    }

    return true;

}
