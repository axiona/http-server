import Validator from '@alirya/validator/simple';

export default function RecordValidator() : Validator<number, 1> {

    return ((value: number) => ({
        value,
        valid: value === 1,
        message : 'message'
    })) as Validator<number, 1>;
}
