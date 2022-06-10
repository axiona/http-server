import Validator from '@alirya/validator/simple';
import MapAllParameters from '../../../../object/dist/validator/map-all-parameters';
import StringParameters from '../../../../string/dist/validator/string-parameters';
import And from '../../../../object/dist/validatable/and';
import Map from '../../../../object/dist/message/message/record/map';

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
