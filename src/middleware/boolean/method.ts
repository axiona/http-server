import Function from '@alirya/function/boolean/function.js';
import {ExistsParameters} from '@alirya/object/property/boolean/exists.js';
import Middleware from '../middleware.js';
import {MethodType} from '../method.js';


export default function Method<Type extends Middleware>(type: Type) : type is Type & MethodType {

    if(!Function(type)) {

        return false;
    }

    if(!ExistsParameters(type, 'methods') || !Array.isArray(type.methods)) {

        return false;
    }

    return true;

}
