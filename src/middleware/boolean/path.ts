import Function from '@alirya/function/boolean/function';
import ExistsParameters from '@alirya/object/property/boolean/exists-parameters';
import Middleware from '../middleware';
import {PathReturn} from '../path';
import String from '../../../../string/dist/boolean/string';


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