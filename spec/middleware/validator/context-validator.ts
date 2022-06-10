import String from '@alirya/string/boolean/string';
import Validator from '@alirya/validator/simple';
import Validatable from '@alirya/validator/validatable/simple';
import Context from '../../../dist/context/context';


export default <Validator<Context & {data ?: string}, Context & {data : string}>> function ContextValidator<
    Ctx extends Context & {data ?: string}
>(
    context : Ctx,
) : Validatable<
        Ctx,
        Ctx & {data : string}
> {

    const valid = String(context.data);

    return {
        valid,
        message : valid ? 'valid' : 'invalid',
        value : context as Ctx & {data : string}
    };
};
