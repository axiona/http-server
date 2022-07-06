import ErrorHandlerType from '../error-handler.js';
import Function from '@alirya/function/boolean/function.js';
import {ExistsParameters} from '@alirya/object/property/boolean/exists.js';


export default function ErrorHandler<Type extends object>(type: Type) : type is Type & ErrorHandlerType {


    if(!ExistsParameters(type, 'register') || !Function(type.register)) {

        return false;
    }

    if(!ExistsParameters(type, 'catch') || !Function(type.catch)) {

        return false;
    }

    return true;

}
