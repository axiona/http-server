import Function from '@alirya/function/boolean/function';
import {ExistsParameters} from '@alirya/object/property/boolean/exists';
import Middleware from '../middleware';
import {MethodType} from '../method';


export default function Method<Type extends Middleware>(type: Type) : type is Type & MethodType {

    if(!Function(type)) {

        return false;
    }

    if(!ExistsParameters(type, 'methods') || !Array.isArray(type.methods)) {

        return false;
    }

    return true;

}
