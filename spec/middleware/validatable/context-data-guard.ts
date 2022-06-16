import Validator from '@alirya/validator/simple';
import MapAllParameters from '../../../../object/dist/validator/map-all-parameters';
import StringParameters from '../../../../string/dist/validator/string-parameters';
import And from '../../../../object/dist/validatable/and';
import Map from '../../../../object/dist/message/message/record/map';
import Context from '../../../dist/context/context';


export default function ContextDataGuard(value : Context & {data?:unknown}) : value is Context & {data:string} {

    return typeof value.data === 'string';
}

