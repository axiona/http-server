import Validator from '@alirya/validator/simple.js';
import {MapAllParameters} from '@alirya/object/validator/map-all.js';
import {StringParameters} from '@alirya/string/validator/string.js';
import And from '@alirya/object/validatable/and.js';
import Map from '@alirya/object/message/message/record/map.js';

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
