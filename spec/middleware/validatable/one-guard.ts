import Validator from '@alirya/validator/simple';
import MapAllParameters from '../../../../object/dist/validator/map-all-parameters';
import StringParameters from '../../../../string/dist/validator/string-parameters';
import And from '../../../../object/dist/validatable/and';
import Map from '../../../../object/dist/message/message/record/map';


export default function OneGuard(value : number) : value is 1 {

    return value === 1;
}

