import String from '@alirya/string/boolean/string.js';
import Validator from '@alirya/validator/simple.js';
import Validatable from '@alirya/validator/validatable/simple.js';
import Context from '../../../dist/context/context.js';


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
