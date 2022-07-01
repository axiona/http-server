import Validator from '@alirya/validator/simple';
import {MapAllParameters} from '@alirya/object/validator/map-all';
import {StringParameters} from '@alirya/string/validator/string';
import And from '@alirya/object/validatable/and';
import Map from '@alirya/object/message/message/record/map';

export type ValidatorType = { name : string, address : string };

export default function RecordValidator() : Validator<object, ValidatorType> {

    return MapAllParameters({
        name : StringParameters(),
        address : StringParameters(),
    }, And, Map);
}


const result = RecordValidator()({});

if(result.valid) {

    let name : string = result.value.name;
    let address : string = result.value.address;

} else {

    // @ts-expect-error
    let name : string = result.value.name;

    // @ts-expect-error
    let address : string = result.value.address;
}
