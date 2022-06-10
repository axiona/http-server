import ErrorHandlerType from '../error-handler';
import Function from '@alirya/function/boolean/function';
import ExistsParameters from '@alirya/object/property/boolean/exists-parameters';


export default function ErrorHandler<Type extends object>(type: Type) : type is Type & ErrorHandlerType {


    if(!ExistsParameters(type, 'register') || !Function(type.register)) {

        return false;
    }

    if(!ExistsParameters(type, 'catch') || !Function(type.catch)) {

        return false;
    }

    return true;

}